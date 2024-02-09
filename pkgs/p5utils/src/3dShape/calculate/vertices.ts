import { Vector } from 'p5'
import { vectorFromDegreeAngles } from '../../3d'
import { calcPerpendicularVector, createTetraAngles, sortByDistance } from '../tools'
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

const VERTICES_PER_NODE = 4

export const collectVerticesEvenlyFromEachEdge = (
  from: Vector,
  edgesWithVertices: ShapeNode[]
): ShapeVertex[] => {
  const sortedVertices = edgesWithVertices
    .sort((a, b) => a.position.dist(from) - b.position.dist(from))
    .map((edge) => edge.vertices.slice().sort(sortByDistance(from)))
  const collected: ShapeVertex[] = []
  for (const sv of sortedVertices) {
    if (collected.length === VERTICES_PER_NODE) {
      return collected
    }
    collected.push(pickHead(sv))
  }
  const flattened = sortedVertices.flatMap((sv) => sv)
  const otherNearVertices = collectNearestVertices(
    from,
    flattened,
    VERTICES_PER_NODE - collected.length
  )
  collected.push(...otherNearVertices)
  return collected

  function pickHead<T>(arr: T[]) {
    const [r] = arr.splice(0, 1)
    return r
  }
}

export const collectNearestVertices = (
  from: Vector,
  vertices: ShapeVertex[],
  numOfVertices: number
): ShapeVertex[] => {
  return vertices.sort(sortByDistance(from)).slice(0, numOfVertices)
}

export const calcNewVertices = (
  node: ShapeNode,
  existingEdgeVertices: ShapeVertex[],
  distanceFromNode: number
): ShapeVertex[] => {
  if (existingEdgeVertices.length === 0) return calcTetraVerticesAroundNode(node, distanceFromNode)
  if (existingEdgeVertices.length === 3) return [calcLastVertex(node, existingEdgeVertices, distanceFromNode)]
  if (existingEdgeVertices.length >= 4) return []
  throw Error()
}

export const calcTetraVerticesAroundNode = (
  node: ShapeNode,
  distanceFromNode: number
): ShapeVertex[] =>
  createTetraAngles(node.rotate || { theta: 0, phi: 0 })
    .map(({ theta, phi }) => vectorFromDegreeAngles(theta, phi, distanceFromNode))
    .map((tetraVec) => tetraVec.add(node.position))

export const calcLastVertex = (node: ShapeNode, vertices: ShapeVertex[], distanceFromNode: number): ShapeVertex => {
  if (vertices.length !== 3) throw Error(`should have 3 vertices`)
  const surfaceCopies = vertices.map((vertex) => vertex.copy())
  const perpendicular = calcPerpendicularVector(surfaceCopies)
  if (perpendicular.dot(node.position) < 0) {
    perpendicular.mult(-1)
  }
  return perpendicular.mult(distanceFromNode).add(node.position)
}
