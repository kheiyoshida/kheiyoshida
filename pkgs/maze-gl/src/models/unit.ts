import { Mesh } from './mesh'
import { Vector3D } from '../vector'

export type RenderUnit = {
  meshes: Mesh[]
  box: DeformedBox
}

export type DeformedBox = {
  FBL: Vector3D
  FBR: Vector3D
  FTL: Vector3D
  FTR: Vector3D
  BBL: Vector3D
  BBR: Vector3D
  BTL: Vector3D
  BTR: Vector3D
}

export type DeformedBoxNormals = {
  normalFBL: Vector3D
  normalFBR: Vector3D
  normalFTL: Vector3D
  normalFTR: Vector3D
  normalBBL: Vector3D
  normalBBR: Vector3D
  normalBTL: Vector3D
  normalBTR: Vector3D
}
