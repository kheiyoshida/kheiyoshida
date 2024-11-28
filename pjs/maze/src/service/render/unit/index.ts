import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { convertToClassicGeometryCodes } from './geometry/default.ts'
import { GeometryCodeConverter, UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'
import { TerrainRenderStyle } from '../../../domain/translate/object.ts'
import { convertToPoles, convertToTiles } from './geometry/poles.ts'

const converters: Record<TerrainRenderStyle, GeometryCodeConverter> = {
  default_: convertToClassicGeometryCodes,
  poles: convertToPoles,
  tiles: convertToTiles,
}

export const convertRenderGridToUnitSpecList = (renderGrid: RenderGrid, style: TerrainRenderStyle): UnitSpec[] => {
  const modelCodeGrid = converters[style](renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
