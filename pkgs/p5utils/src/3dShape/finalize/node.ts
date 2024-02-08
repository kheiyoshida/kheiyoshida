import { ShapeNode, ShapeVertex } from '../types'
import { finalizeSurface } from './surface'

export const finalizeNodeSurfaces = (node: ShapeNode) => {
  const surfaces = extractNodeSurfaceVertices(node)
  surfaces.forEach(finalizeSurface)
}

export const extractNodeSurfaceVertices = (node: ShapeNode): ShapeVertex[][] => {
  return node.vertices.map((v) => node.vertices.filter((ver) => ver !== v))
}
