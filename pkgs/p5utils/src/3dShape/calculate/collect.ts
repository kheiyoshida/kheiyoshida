import { Vector } from 'p5'
import { sortByDistance } from '../tools'
import { ShapeNode, ShapeVertex } from '../types'

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


