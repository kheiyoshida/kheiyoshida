import { Position3D } from "p5utils/src/3d"

/**
 * geometry specifications to represent `RenderModel`
 */
export type GeometrySpec = {
  coords: ShapeCoordinates
  normalPosition: Position3D
}

/**
 * rectangle coordinates
 */
export type ShapeCoordinates = Position3D[]
