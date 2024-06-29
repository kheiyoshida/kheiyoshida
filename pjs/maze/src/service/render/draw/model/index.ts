import { TerrainRenderStyle } from '../../../../domain/translate'
import { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import { convertToBoxesModelGrid } from './converters/boxes'
import { convertToNormalModelGrid } from './converters/normal'
import { injectGridPositionToModels } from './inject'
import { GridConverter, RenderModel } from './types'

const ConverterMap: Record<TerrainRenderStyle, GridConverter> = {
  normal: convertToNormalModelGrid,
  boxes: convertToBoxesModelGrid,
}

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): RenderModel[] => {
  const modelCodeGrid = ConverterMap[style](renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types'
