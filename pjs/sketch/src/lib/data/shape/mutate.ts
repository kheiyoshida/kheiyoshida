import p5 from 'p5'
import { ShapeNode, Vertex } from './types'
import { calcCenter, calcPerpendicularVector } from './utils'

const DISTANCE_SURFACE_RATIO = 0.5

/**
 * adjust the distance of node against surface
 * @param node
 * @param surface
 */
export const adjustNodePositionFromSurface = (
  node: ShapeNode,
  surface: Vertex[]
): void => {
  const center = calcCenter(surface.map((v) => v.position))
  const dist = node.position.dist(center)
  const idealDistance = node.option.distanceFromNode * DISTANCE_SURFACE_RATIO
  if (dist > idealDistance) {
    // TODO: not accurate for now
    node.position = center
      .copy()
      .add(
        calcPerpendicularVector(surface.map((v) => v.position)).mult(
          idealDistance
        )
      )
  }
}

export const adjustNodePositionInTetra = (node: ShapeNode): void => {
  node.position = calcCenter(node.vertices.map((v) => v.position))
}

export const adjustNodePositionFromEdge = (
  node: ShapeNode,
  minimumDistance = node.option.distanceFromNode * 1.3
): void => {
  if (node.edges.length === 0) {
    throw Error('no edges for this node')
  }
  if (node.edges.length === 1) {
    const edge = node.edges[0]
    const diff = node.position.sub(edge.position)
    if (diff.mag() < minimumDistance) {
      node.position = edge.position.copy().add(diff.setMag(minimumDistance))
    }
  }
  if (node.edges.length === 2) {
    if (
      node.edges.some(
        (edge) => node.position.dist(edge.position) < minimumDistance
      )
    ) {
      const [{ position: edge1 }, { position: edge2 }] = node.edges
      const opp = edge1.copy().sub(edge2)
      const oppLength = opp.mag()
      const oppMiddle = p5.Vector.lerp(edge1, edge2, 0.5)
      const adjLen = Math.sqrt(
        Math.pow(minimumDistance, 2) - Math.pow(oppLength / 2, 2)
      )
      const adj = calcPerpendicularVector([node.position, edge1, edge2]).setMag(
        adjLen
      )
      node.position = oppMiddle.copy().add(adj)
    }
  }
  if (node.edges.length === 3) {
    if (
      node.edges.some(
        (edge) => node.position.dist(edge.position) < minimumDistance
      )
    ) {
      const edges = node.edges.map((e) => e.position)
      const perpendicular =
        calcPerpendicularVector(edges).setMag(minimumDistance)
      const center = calcCenter(edges)
      node.position = center.copy().add(perpendicular)
    }
  }
}
