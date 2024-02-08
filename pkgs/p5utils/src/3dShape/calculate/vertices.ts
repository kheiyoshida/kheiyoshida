import p5, { Vector } from 'p5'
import { vectorFromDegreeAngles } from '../../3d'
import { createTetraAngles } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'

export const calcVerticesAroundNode = (node: ShapeNode, distanceFromNode: number): void => {
  const edgesVertices = collectEdgesVertices(node)
  const newVertices = calcNewVertices(node, edgesVertices, distanceFromNode)
  node.vertices = [...edgesVertices, ...newVertices]
}

export const collectEdgesVertices = (node: ShapeNode): ShapeVertex[] => {
  const edgesWithVertices = node.edges.filter((e) => e.vertices.length)
  if (edgesWithVertices.length === 0) return []
  else if (edgesWithVertices.length === 1)
    return collectNearestVertices(node.position, edgesWithVertices[0].vertices, 3)
  return collectVerticesEvenlyFromEachEdge(node.position, edgesWithVertices)
}

export const collectVerticesEvenlyFromEachEdge = (
  from: Vector,
  edgesWithVertices: ShapeNode[]
): ShapeVertex[] => {
  const allVertices = edgesWithVertices.flatMap((edge) => edge.vertices)
  return collectNearestVertices(from, allVertices, 4)
}

export const collectNearestVertices = (
  from: Vector,
  vertices: ShapeVertex[],
  numOfVertices: number
): ShapeVertex[] => {
  return vertices.sort((a, b) => a.dist(from) - b.dist(from)).slice(0, numOfVertices)
}

export const calcNewVertices = (
  node: ShapeNode,
  existingEdgeVertices: ShapeVertex[],
  distanceFromNode: number
): ShapeVertex[] => {
  if (existingEdgeVertices.length === 0) return calcTetraVerticesAroundNode(node, distanceFromNode)
  if (existingEdgeVertices.length === 3) return [new p5.Vector(100, 100, 100)]
  if (existingEdgeVertices.length >= 4) return []
  throw Error()
}

export const calcTetraVerticesAroundNode = (
  node: ShapeNode,
  distanceFromNode: number
): ShapeVertex[] =>
  createTetraAngles({ theta: 0, phi: 0 })
    .map(({ theta, phi }) => vectorFromDegreeAngles(theta, phi, distanceFromNode))
    .map((tetraVec) => tetraVec.add(node.position))
