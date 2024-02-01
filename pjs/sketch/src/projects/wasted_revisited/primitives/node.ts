import p5 from 'p5'
import { sumVectorAngles, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { Position3D } from 'p5utils/src/camera/types'
import { createBase3D } from 'p5utils/src/data/node/3d'
import { VectorAngles } from 'p5utils/src/data/node/types'
import { ArgsRandomizer, distribute } from 'utils'

export type TreeNode = {
  position: Position3D
  hasGrown: boolean
  growDirection: VectorAngles
  edges: TreeNode[]
  emitEdges: (
    numEdges: number,
    thetaDelta: number,
    length: number,
    randomizer?: ArgsRandomizer<ReturnType<typeof emitNodeEdge>>
  ) => TreeNode[]
}

export const createGraphNode = (
  position: Position3D,
  growDirection: VectorAngles = { theta: 0, phi: 0 }
): TreeNode => {
  const _node = createBase3D(new p5.Vector(...position))
  const edges: TreeNode[] = []
  return {
    get position() {
      return _node.position.array() as Position3D
    },
    edges,
    hasGrown: false,
    growDirection,
    emitEdges(numEdges, thetaDelta, length, randomizer) {
      const emit = emitNodeEdge(this)
      return distribute(360, numEdges).map((phiDelta) => {
        const delta = { theta: thetaDelta, phi: phiDelta }
        return randomizer ? emit(...randomizer(delta, length)) : emit(delta, length)
      })
    },
  }
}

export const emitNodeEdge =
  (node: TreeNode) =>
  (directionDelta: VectorAngles, growAmount: number): TreeNode => {
    const newDir = sumVectorAngles(node.growDirection, directionDelta)
    const posDelta = vectorFromDegreeAngles(newDir.theta, newDir.phi, growAmount)
    const newPosition = posDelta.add(node.position).array() as Position3D
    const edge = createGraphNode(newPosition as Position3D, newDir)
    node.edges.push(edge)
    return edge
  }
