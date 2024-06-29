import { TerrainRenderStyle } from '../../../../domain/translate'
import { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import { convertToNormalModelGrid } from './converters/normal'
import { convertToBoxesModelGrid } from './converters/poles'
import { tiles } from './converters/tiles'
import { injectGridPositionToModels } from './inject'
import { GridConverter, RenderModel } from './types'

const ConverterMap: Record<TerrainRenderStyle, GridConverter> = {
  normal: convertToNormalModelGrid,
  poles: convertToBoxesModelGrid,
  tiles: tiles,
}

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): RenderModel[] => {
  const modelCodeGrid = ConverterMap[style](renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types'
