import p5 from 'p5'
import { randomAngle, sumVectorAngles, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { Position3D } from 'p5utils/src/camera/types'
import { createBase3D } from 'p5utils/src/data/node/3d'
import { VectorAngles } from 'p5utils/src/3d/types'
import { ArgsRandomizer, distribute, randomIntInclusiveBetween } from 'utils'
import * as NODE from 'p5utils/src/data/node'
import * as NODE3D from 'p5utils/src/data/node/3d'

export type TreeNode = {
  position: Position3D
  hasGrown: boolean
  growDirection: VectorAngles
  edges: TreeNode[]
  emitEdges: (
    numEdges: number,
    thetaDelta: number,
    growAmount: number,
    randomizer?: ArgsRandomizer<ReturnType<typeof emitNodeEdge>>
  ) => TreeNode[]
  move: () => void
}

export const createGraphNode = (
  position: Position3D,
  growDirection: VectorAngles = { theta: 0, phi: 0 },
  moveAmount = 100,
  movableDistance = moveAmount * 3,
  decreaseSpeed = (speed: number) => speed,
  changeDirection = (angle: VectorAngles) => angle
): TreeNode => {
  const initialPosition = position
  const _node = createBase3D(new p5.Vector(...position), randomAngle(), moveAmount)
  const edges: TreeNode[] = []
  return {
    get position() {
      return _node.position.array() as Position3D
    },
    edges,
    hasGrown: false,
    growDirection,
    emitEdges(numEdges, thetaDelta, growAmount, randomizer) {
      const emit = emitNodeEdge(this, decreaseSpeed, changeDirection)
      return distribute(360, numEdges).map((phiDelta) => {
        const delta = { theta: thetaDelta, phi: phiDelta }
        return randomizer ? emit(...randomizer(delta, growAmount)) : emit(delta, growAmount)
      })
    },
    move() {
      NODE.move(_node)
      NODE3D.restrain3dFromPosition(_node)(initialPosition, movableDistance)
      NODE.changeSpeedV2(_node, decreaseSpeed)
      const { theta, phi } = changeDirection(_node.angles)
      NODE3D.rotate3D(_node, theta, phi)
    },
  }
}

export const emitNodeEdge =
  (
    node: TreeNode,
    decreaseSpeed?: (speed: number) => number,
    changeDirection?: (angle: VectorAngles) => VectorAngles
  ) =>
  (directionDelta: VectorAngles, growAmount: number): TreeNode => {
    const newDir = sumVectorAngles(node.growDirection, directionDelta)
    const posDelta = vectorFromDegreeAngles(newDir.theta, newDir.phi, growAmount)
    const newPosition = posDelta.add(node.position).array() as Position3D
    const moveAmount = randomIntInclusiveBetween(10, 50)
    const edge = createGraphNode(
      newPosition as Position3D,
      newDir,
      moveAmount,
      moveAmount * 3,
      decreaseSpeed,
      changeDirection
    )
    node.edges.push(edge)
    return edge
  }
