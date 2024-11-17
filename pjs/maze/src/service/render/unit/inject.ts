import { GeometryCode, GeometryCodeGrid } from './geometry/types.ts'
import { MeshKey, UnitSpec } from './types.ts'

export const injectGridPositionToModels = (grid: GeometryCodeGrid): UnitSpec[] =>
  grid.flatMap((layer, z) =>
    layer.flatMap((compound, x) => ({
      keys: compound.map(convertModelCodeToMeshKey),
      position: { x, z },
    }))
  )

const convertModelCodeToMeshKey = (code: GeometryCode): MeshKey => code
