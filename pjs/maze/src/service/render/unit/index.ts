import { LogicalView, ModelingStyle } from '../../../integration/query'
import { convertToClassicGeometryCodes } from './geometry/default.ts'
import { GeometryCodeConverter, UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'
import { convertToPoles } from './geometry/poles.ts'
import { convertToTiles } from './geometry/tiles.ts'

const converters: Record<ModelingStyle, GeometryCodeConverter> = {
  classic: convertToClassicGeometryCodes,
  poles: convertToPoles,
  tiles: convertToTiles,
}

export const convertRenderGridToUnitSpecList = (renderGrid: LogicalView, style: ModelingStyle): UnitSpec[] => {
  const modelCodeGrid = converters[style](renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
