import { vectorFromDegreeAngles } from '../../3d'
import { createTetraAngles } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'

export const calculateVerticesAroundNode = (node: ShapeNode, distanceFromNode: number): void => {
  // const edgeVertices = collectEdgevertices(node)
  const newVertices = calcTetraVerticesAroundNode(node, distanceFromNode)
  node.vertices = newVertices
}

const collectEdgevertices = (node: ShapeNode): ShapeVertex[] => {
  return node.edges.flatMap((edge) => edge.vertices)
}

export const calcTetraVerticesAroundNode = (
  node: ShapeNode,
  distanceFromNode: number
): ShapeVertex[] => {
  return createTetraAngles({ theta: 0, phi: 0 })
    .map(({ theta, phi }) => vectorFromDegreeAngles(theta, phi, distanceFromNode))
    .map((tetraVec) => tetraVec.add(node.position))
}
