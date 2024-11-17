import { GeometryCode } from '../../unit'
import { GeometrySpec } from 'maze-gl'
import * as specs from './specs.ts'

export const GeometrySpecDict: Record<GeometryCode, GeometrySpec> = {
  [GeometryCode.Ceil]: specs.Ceil,
  [GeometryCode.Floor]: specs.Floor,
  [GeometryCode.FrontWall]: specs.FrontWall,
  [GeometryCode.LeftWall]: specs.LeftWall,
  [GeometryCode.RightWall]: specs.RightWall,
  [GeometryCode.Stair]: specs.Floor, // TODO: implement stair
}
