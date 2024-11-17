import { ModelCode, ModelCodeGrid } from './model/types.ts'
import type { MeshKey, UnitSpec } from './types.ts'

export const injectGridPositionToModels = (grid: ModelCodeGrid): UnitSpec[] =>
  grid.flatMap((layer, z) =>
    layer.flatMap((compound, x) => ({
      keys: compound.map(convertModelCodeToMeshKey),
      position: { x, z },
    }))
  )

const convertModelCodeToMeshKey = (code: ModelCode): MeshKey => code
