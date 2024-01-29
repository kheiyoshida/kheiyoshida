import p5 from 'p5'
import { randomFloatBetween } from 'utils'
import { BaseNode3D } from '../node/types'
import {
  adjustNodePositionFromEdge,
  adjustNodePositionFromSurface,
  adjustNodePositionInTetra,
} from './mutate'
import { Shape, ShapeNode, ShapeNodeOption, Vertex } from './types'
import { calcPerpendicularVector, getNearestVertices } from './utils'

const VERTICES_IN_NODE = 4

export const createInitialNode = (
  node: BaseNode3D,
  option: ShapeNodeOption
): ShapeNode => ({
  ...node,
  edges: [],
  vertices: [],
  option,
})

/**
 * calculate vertices for each node in the shape graph
 * @param graph graph filled with initial nodes that don't have vertices yet
 */
export const calculateVertices = (graph: Shape['graph']): Shape => {
  const vertices: Vertex[] = []
  for (const node of graph) {
    const edgeVertices = collectEdgeVertices(node)
    const newVertices = calculateNodeVertices(node, edgeVertices)
    const nodeVertices = [...edgeVertices, ...newVertices]
    nodeVertices.forEach((v) => node.vertices.push(v))
    newVertices.forEach((v) => vertices.push(v))
    adjustNodePositionInTetra(node)
  }
  return { vertices, graph }
}

/**
 * collect edges' vertices
 * @param node
 * @todo refactor if any performance issues
 */
export const collectEdgeVertices = (node: ShapeNode): Vertex[] => {
  const edgesWithVertices = node.edges.filter((edge) => edge.vertices.length)
  if (edgesWithVertices.length === 0) return []
  else if (edgesWithVertices.length === 1) {
    const nearestSurface = getNearestVertices(node, edgesWithVertices)
    adjustNodePositionFromSurface(node, nearestSurface)
    return nearestSurface
  } else {
    adjustNodePositionFromEdge(node)
    return getNearestVertices(node, edgesWithVertices)
  }
}

/**
 * calculate the vertices' positions based on the option
 * @param node
 */
export const calculateNodeVertices = (
  node: ShapeNode,
  edgeVertices: Vertex[]
): Vertex[] => {
  if (edgeVertices.length === VERTICES_IN_NODE) return []
  if (edgeVertices.length === VERTICES_IN_NODE - 1)
    return [createPerpendicularVertex(node, edgeVertices)]
  return createTetraVertices(node.option.distanceFromNode).map((angle) => ({
    position: node.position.copy().add(angle),
  }))
}

const TETRAHEDRAL_ANGLE = 1.9111355 // 109.5
const ONE_THIRD = 2.0944 // 120
export const createTetraVertices = (
  length: number,
  phi = randomFloatBetween(0, 3.14),
  rand = 0
): p5.Vector[] => {
  const v1 = p5.Vector.fromAngles(0, 0, randomFloatBetween(length, length + rand))
  const rest = [...Array(3)].map((_, i) =>
    p5.Vector.fromAngles(
      TETRAHEDRAL_ANGLE,
      phi + ONE_THIRD * (i + 1),
      randomFloatBetween(length, length + rand)
    )
  )
  return [v1, ...rest]
}

/**
 * create a vertex that is perpendicular against the surface
 */
export const createPerpendicularVertex = (
  node: ShapeNode,
  surface: Vertex[]
): Vertex => {
  if (surface.length !== 3) throw Error('surface must have 3 vertices')
  const perpendicular = calcPerpendicularVector(surface.map((v) => v.position))
  return {
    position: node.position
      .copy()
      .add(perpendicular.mult(node.option.distanceFromNode)),
  }
}
