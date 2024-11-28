import { GeometryCode } from '../../unit'
import { GeometrySpec } from 'maze-gl'
import * as rectangles from './rectangles.ts'
import * as objects from './objects.ts'

export const GeometrySpecDict: Record<GeometryCode, GeometrySpec> = {
  [GeometryCode.Ceil]: rectangles.Ceil,
  [GeometryCode.Floor]: rectangles.Floor,
  [GeometryCode.FrontWall]: rectangles.FrontWall,
  [GeometryCode.LeftWall]: rectangles.LeftWall,
  [GeometryCode.RightWall]: rectangles.RightWall,
  [GeometryCode.Octahedron]: objects.Octahedron,
  [GeometryCode.Pole]: objects.Pole,
  [GeometryCode.Tile]: objects.Tile,
}
