import { TerrainRenderStyle } from '../../../../domain/translate'
import { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import { ModelGrid } from '../types'
import { convertToNormalModelGrid } from './patterns/normal'

export type GridConverter = (rendewrGrid: RenderGrid) => ModelGrid

const ConverterMap: Record<TerrainRenderStyle, GridConverter> = {
  normal: convertToNormalModelGrid,
  boxes: convertToNormalModelGrid,
}

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): ModelGrid => {
  return ConverterMap[style](renderGrid)
}
