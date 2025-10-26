import { GeometryRenderingSpec, UnitSpec } from './types.ts'

export const injectGridPositionToModels = (spec: GeometryRenderingSpec): UnitSpec[] => {
  const unitSpecs: UnitSpec[] = spec.grid.flatMap((layer, z) =>
    layer.flatMap((codes, x) => ({
      position: { x, z },
      codes,
    }))
  )

  if (spec.altGrid) {
    for (const alt of spec.altGrid) {
      const altUnitSpecs: UnitSpec[] = alt.grid.flatMap((layer, z) =>
        layer.flatMap((codes, x) => ({
          position: { x, z, y: alt.yLayerOffset },
          codes,
        }))
      )
      unitSpecs.push(...altUnitSpecs)
    }
  }

  return unitSpecs
}
