import { ShapeNode, ShapeVertex } from '../types'
import { finalizeSurface } from './surface'

export const finalizeNodeSurfaces = (node: ShapeNode) => {
  if (node.vertices.length !== 4) throw Error(`node must have 4 vertices`)
  const surfaces = extractNodeSurfaceVertices(node.vertices)
  surfaces.forEach((s) => finalizeSurface(...s))
}

export const extractNodeSurfaceVertices = (
  vertices: ShapeNode['vertices']
): [surfaceVertices: ShapeVertex[], theOther: ShapeVertex][] => {
  return [0, 1, 2, 3].map((surfaceNumber) => [
    vertices.filter((_, i) => i !== surfaceNumber),
    vertices[surfaceNumber],
  ])
}
