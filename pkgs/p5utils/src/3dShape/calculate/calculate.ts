import { vectorFromDegreeAngles } from '../../3d'
import { calcPerpendicularVector, createTetraAngles, isInTheSameSide } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'

export const calcNewVertices = (
  node: ShapeNode,
  existingEdgeVertices: ShapeVertex[]
): ShapeVertex[] => {
  if (existingEdgeVertices.length === 0) return calcTetraVerticesAroundNode(node)
  if (existingEdgeVertices.length === 3) return [calcLastVertex(node, existingEdgeVertices)]
  if (existingEdgeVertices.length >= 4) return []
  throw Error()
}

export const calcTetraVerticesAroundNode = (node: ShapeNode): ShapeVertex[] =>
  createTetraAngles(node.rotate || { theta: 0, phi: 0 })
    .map(({ theta, phi }) => vectorFromDegreeAngles(theta, phi, node.distanceToEachVertex))
    .map((tetraVec) => tetraVec.add(node.position))

export const calcLastVertex = (node: ShapeNode, vertices: ShapeVertex[]): ShapeVertex => {
  if (vertices.length !== 3) throw Error(`should have 3 vertices`)
  const surfaceCopies = vertices.map((vertex) => vertex.copy())
  const perpendicular = calcPerpendicularVector(surfaceCopies)
  if (!isInTheSameSide(perpendicular, node.position)) {
    perpendicular.mult(-1)
  }
  return perpendicular.mult(node.distanceToEachVertex).add(node.position)
}
