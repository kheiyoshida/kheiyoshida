import { RenderGrid, TerrainStyle } from '../../../domain/query'
import { convertToClassicGeometryCodes } from './geometry/default.ts'
import { GeometryCodeConverter, UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'
import { convertToPoles } from './geometry/poles.ts'
import { convertToTiles } from './geometry/tiles.ts'

const converters: Record<TerrainStyle, GeometryCodeConverter> = {
  default_: convertToClassicGeometryCodes,
  poles: convertToPoles,
  tiles: convertToTiles,
}

export const convertRenderGridToUnitSpecList = (renderGrid: RenderGrid, style: TerrainStyle): UnitSpec[] => {
  const modelCodeGrid = converters[style](renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
