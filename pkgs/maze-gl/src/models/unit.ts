import { Mesh } from './mesh'
import { Vector3D } from './geometry'

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

export type DeformedBoxNormals = {
  normalFBL: Vector
  normalFBR: Vector
  normalFTL: Vector
  normalFTR: Vector
  normalBBL: Vector
  normalBBR: Vector
  normalBTL: Vector
  normalBTR: Vector
}
