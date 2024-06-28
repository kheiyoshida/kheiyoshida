import { TerrainRenderStyle } from '../../../../domain/translate'
import { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import { convertToBoxesModelGrid } from './converters/boxes'
import { convertToNormalModelGrid } from './converters/normal'
import { GridConverter, ModelGrid } from './types'

const ConverterMap: Record<TerrainRenderStyle, GridConverter> = {
  normal: convertToNormalModelGrid,
  boxes: convertToBoxesModelGrid,
}

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): ModelGrid => {
  return ConverterMap[style](renderGrid)
}

export * from './types'
