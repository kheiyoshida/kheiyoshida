import { Mesh } from './mesh'
import { Vector } from './geometry'

export type RenderUnit = {
  meshes: Mesh[]
  box: DeformedBox
}

export type DeformedBox = {
  FBL: Vector
  FBR: Vector
}



