import { vectorFromDegreeAngles } from '../../3d'
import { calcPerpendicularVector } from '../../data/shape/utils'
import { createTetraAngles } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'

export const calcVerticesAroundNode = (node: ShapeNode, distanceFromNode: number): void => {
  const edgeVertices = collectEdgeVertices(node)
  if (edgeVertices.length === 3) {
    node.vertices = [...edgeVertices, calcPerpendicularVector(edgeVertices).mult(distanceFromNode)]
  } else {
    node.vertices = calcTetraVerticesAroundNode(node, distanceFromNode)
  }
}

export const collectEdgeVertices = (node: ShapeNode): ShapeVertex[] => {
  return node.edges
    .flatMap((edge) => edge.vertices)
    .sort((a, b) => a.dist(node.position) - b.dist(node.position))
    .slice(0, 3)
}

export const calcTetraVerticesAroundNode = (
  node: ShapeNode,
  distanceFromNode: number
): ShapeVertex[] =>
  createTetraAngles({ theta: 0, phi: 0 })
    .map(({ theta, phi }) => vectorFromDegreeAngles(theta, phi, distanceFromNode))
    .map((tetraVec) => tetraVec.add(node.position))
