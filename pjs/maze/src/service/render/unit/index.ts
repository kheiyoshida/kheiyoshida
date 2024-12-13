import { RenderGrid } from '../../../domain/query/structure/renderGrid/renderSpec.ts'
import { convertToClassicGeometryCodes } from './geometry/default.ts'
import { GeometryCodeConverter, UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'
import { TerrainRenderStyle } from '../../../domain/query/structure/terrainStyle.ts'
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
