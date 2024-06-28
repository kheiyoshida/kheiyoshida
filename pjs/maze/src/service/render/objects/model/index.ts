import { TerrainRenderStyle } from '../../../../domain/translate'
import { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import { convertToBoxesModelGrid } from './converters/boxes'
import { convertToNormalModelGrid } from './converters/normal'
import { GridConverter, ModelCodeGrid } from './types'

const ConverterMap: Record<TerrainRenderStyle, GridConverter> = {
  normal: convertToNormalModelGrid,
  boxes: convertToBoxesModelGrid,
}

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): ModelCodeGrid => {
  return ConverterMap[style](renderGrid)
}

export * from './types'
