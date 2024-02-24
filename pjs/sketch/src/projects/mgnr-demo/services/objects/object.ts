import p5 from 'p5'
import { Position3D, distanceBetweenPositions } from 'p5utils/src/3d'
import { drawAtVectorPosition } from 'p5utils/src/render'

export type GeometryObject = {
  placement: p5.Vector
  geometry: p5.Geometry
}

export const renderGeometryObject = (center: Position3D, object: GeometryObject) => {
  drawAtVectorPosition(object.placement, () => {
    p.model(object.geometry)
  })
}

export const distanceFromCenter = (placement: p5.Vector, center: Position3D) => {
  return distanceBetweenPositions(placement.array() as Position3D, center)
}
