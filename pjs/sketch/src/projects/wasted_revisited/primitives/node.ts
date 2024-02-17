import p5 from 'p5'
import { randomAngle, sumVectorAngles, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { Position3D, VectorAngles } from 'p5utils/src/3d/types'
import * as NODE from 'p5utils/src/data/node'
import * as NODE3D from 'p5utils/src/data/node/3d'
import { createBase3D } from 'p5utils/src/data/node/3d'
import { ArgsRandomizer, distribute, randomIntInclusiveBetween } from 'utils'
import { Config } from '../config'

export type TreeNode = {
  position: Position3D
  hasGrown: boolean
  growDirection: VectorAngles
  edges: TreeNode[]
  emitEdges: (
    numEdges: number,
    thetaDelta: number,
    growAmount: number,
    randomizer?: EmitNodeEdgeRandomizer
  ) => TreeNode[]
  move: () => void
  updateSpeed: (speed: number) => void
  growIndex: number
}

export type EmitNodeEdgeRandomizer = ArgsRandomizer<ReturnType<typeof emitNodeEdge>>

export const createGraphNode = (
  position: Position3D,
  growDirection: VectorAngles = { theta: 0, phi: 0 },
  moveAmount = 100,
  movableDistance = moveAmount * 3,
  decreaseSpeed = (speed: number) => speed,
  changeDirection = (angle: VectorAngles) => angle,
  growIndex = 0
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
    get growIndex() {
      return growIndex
    },
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
    updateSpeed(speed) {
      NODE.changeSpeedV2(_node, speed)
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
    const moveAmount = Config.DefaultMoveAmount
    const edge = createGraphNode(
      newPosition as Position3D,
      newDir,
      moveAmount,
      getMovableDistance(node.growIndex),
      decreaseSpeed,
      changeDirection,
      node.growIndex + 1
    )
    node.edges.push(edge)
    return edge
  }

const getMovableDistance = (nodeIndex: number) => {
  return Config.DefaultMovableDistance / Math.log(nodeIndex + 1)
}