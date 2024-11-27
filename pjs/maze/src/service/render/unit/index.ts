import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { convertToClassicGeometryCodes } from './geometry/classic.ts'
import { GeometryCodeConverter, GeometryCodeGrid, UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'
import { TerrainRenderStyle } from '../../../domain/translate/object.ts'

const converters: Record<TerrainRenderStyle, GeometryCodeConverter> = {
  classic: convertToClassicGeometryCodes,
  poles: convertToClassicGeometryCodes, // TODO: implement
  tiles: convertToClassicGeometryCodes, // TODO: implement
}

export const convertRenderGridToUnitSpecList = (renderGrid: RenderGrid, style: TerrainRenderStyle): UnitSpec[] => {
  const modelCodeGrid = converters[style](renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
