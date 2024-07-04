import type { Geometry, Image } from "p5"
import { Position3D } from "p5utils/src/3d"

export type DrawableObject = {
  geometry: Geometry
  position: Position3D
  rotation?: unknown
  texture?: Image
}
