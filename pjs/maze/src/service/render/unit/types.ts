import type { RenderBlockPosition } from '../scaffold'
import { ModelCode } from './model/types.ts'

export type UnitSpec = {
  keys: MeshKey[]
  position: RenderBlockPosition
}

/**
 * for now, mesh key and model code have 1-1 relationship
 * we might introduce variations in meshes for a model code based on other variant
 */
export type MeshKey = ModelCode
