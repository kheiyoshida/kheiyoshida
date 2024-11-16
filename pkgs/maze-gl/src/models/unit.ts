import { Mesh } from './mesh'
import { Vector } from './geometry'

export type RenderUnit = {
  meshes: Mesh[]
  box: DeformedBox
}

export type DeformedBox = {
  FBL: Vector
  FBR: Vector
  FTL: Vector
  FTR: Vector
  BBL: Vector
  BBR: Vector
  BTL: Vector
  BTR: Vector
}
