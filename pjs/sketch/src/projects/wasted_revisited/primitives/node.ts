import p5 from 'p5'
import { sumVectorAngles, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { Position3D } from 'p5utils/src/camera/types'
import { createBase3D } from 'p5utils/src/data/node/3d'
import { VectorAngles } from 'p5utils/src/data/node/types'
import { distribute } from 'utils'

export type TreeNode = {
  position: Position3D
  hasGrown: boolean
  growDirection: VectorAngles
  edges: TreeNode[]
  emitEdge: (directionDelta: VectorAngles, growAmount: number) => TreeNode
  emitEdges: (numEdges: number, thetaDelta: number, length: number) => TreeNode[]
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
    emitEdge(directionDelta, growAmount) {
      const newDir = sumVectorAngles(this.growDirection, directionDelta)
      const posDelta = vectorFromDegreeAngles(newDir.theta, newDir.phi, growAmount)
      const newPosition = posDelta.add(this.position).array() as Position3D
      const edge = createGraphNode(newPosition as Position3D, newDir)
      edges.push(edge)
      return edge
    },
    emitEdges(numEdges, thetaDelta, length) {
      return distribute(360, numEdges).map((phi) =>
        this.emitEdge({ theta: thetaDelta, phi }, length)
      )
    },
  }
}
