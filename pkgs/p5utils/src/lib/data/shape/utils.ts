import { Vector } from 'p5'
import { ShapeNode, Vertex } from './types'

export const calcPerpendicularVector = ([v1, v2, v3]: Vector[]) =>
  v2.copy().sub(v1).cross(v3.copy().sub(v1)).normalize()

/**
 * calculate the average center of vertices
 * @param vectors
 * @returns
 */
export const calcCenter = (vectors: Vector[]) => {
  return new Vector(
    ...vectors
      .reduce((prev, curr) => curr.array().map((value, i) => prev[i] + value), [0, 0, 0])
      .map((value) => value / vectors.length)
  )
}

/**
 * determine shared vertices to use from the connected edges
 * @param edges
 */
export const collectSharedVertices = (edges: ShapeNode[]): Vertex[] => {
  //
  throw Error()
}

/**
 * get the distance between node and surface (vertices of 3)
 * @param node
 * @param surface
 */
export const calcDistanceFromSurface = (node: ShapeNode, surface: Vertex[]): number =>
  node.position.dist(calcCenter(surface.map((v) => v.position)))

/**
 * get the nearest vertices from the vertices of nodes' edges
 * making sure it takes at least one vertex from each edge,
 * and ignoring shard vertices
 * @param node
 */
export const getNearestVertices = (
  node: ShapeNode,
  edgesWithVertices = node.edges.filter((edge) => edge.vertices.length !== 0)
): Vertex[] => {
  const vertices: Vertex[] = []
  const sortedEdges = edgesWithVertices.map((edge) =>
    edge.vertices
      .slice()
      .sort((a, b) => node.position.dist(a.position) - node.position.dist(b.position))
  )
  const pickVertices = edgesWithVertices.length === 1 ? 3 : 4
  let cursor = 0
  while (vertices.length < pickVertices) {
    const [vertex] = sortedEdges[cursor % edgesWithVertices.length].splice(0, 1)
    if (vertex && !vertices.includes(vertex)) {
      vertices.push(vertex)
    }
    cursor += 1
  }
  return vertices
}
