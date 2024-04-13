import p5 from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { GeometryCoordinates } from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type pExtended = p5 & { beginGeometry: any; endGeometry: any }

export const finalize = (coords: GeometryCoordinates[]) => coords.map(finalizeGeometry)

export const finalizeGeometry = (coords: GeometryCoordinates): p5.Geometry => {
  // eslint-disable-next-line no-extra-semi
  ;(p as pExtended).beginGeometry()
  coords.forEach(finalizeShape)
  return (p as pExtended).endGeometry()
}

export const finalizeShape = (vertices: Position3D[]): void => {
  p.beginShape()
  // TODO: calc normal from the block
  vertices.forEach((vertex) => p.vertex(...vertex))
  p.endShape()
}
