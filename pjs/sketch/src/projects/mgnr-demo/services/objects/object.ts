import p5 from 'p5'
import { drawAtVectorPosition } from 'p5utils/src/render'

export type GeometryObject = {
  placement: p5.Vector
  geometry: p5.Geometry
}

export const renderGeometryObject = (object: GeometryObject) => {
  drawAtVectorPosition(object.placement, () => {
    p.model(object.geometry)
  })
}