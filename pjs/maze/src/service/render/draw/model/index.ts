import { TerrainRenderStyle } from '../../../../domain/translate'
import { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import { convertToNormalModelGrid } from './converters/normal'
import { convertToBoxesModelGrid } from './converters/poles'
import { tiles } from './converters/tiles'
import { injectGridPositionToModels } from './inject'
import { GridConverter, RenderModel } from './types'

/**
 * We're not using this to suppress legacy 'static' models,
 * but we'll eventually come back and introduce patterns with dynamic deformed box + relative-positioned geometries
 */
const ConverterMap: Record<TerrainRenderStyle, GridConverter> = {
  normal: convertToNormalModelGrid,
  poles: convertToBoxesModelGrid,
  tiles: tiles,
}

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): RenderModel[] => {
  const modelCodeGrid = convertToNormalModelGrid(renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types'
