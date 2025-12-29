import { Vector3D } from '../../supporting/vector'
import { SceneObject } from './object'

export type RenderUnit = {
  objects: SceneObject[]
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

export type DeformedBoxNormalsV2 = {
  normalTop: Vector3D
  normalBottom: Vector3D
  normalRight: Vector3D
  normalLeft: Vector3D
  normalFront: Vector3D
  normalBack: Vector3D
}
