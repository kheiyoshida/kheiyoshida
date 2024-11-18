import { GeometryCodeGrid, UnitSpec } from './types.ts'

export const injectGridPositionToModels = (grid: GeometryCodeGrid): UnitSpec[] =>
  grid.flatMap((layer, z) =>
    layer.flatMap((codes, x) => ({
      position: { x, z },
      codes,
    }))
  )
