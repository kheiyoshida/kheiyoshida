import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import { CompoundModelCode, ModelCodeGrid, ModelCodeGridLayer, DynamicModelCode, StaticModelCode } from '../types'

export const tiles = (renderGrid: RenderGrid): ModelCodeGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return modelGrid
}

const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelCodeGridLayer => {
  return renderLayer.map(convertToModel) as ModelCodeGridLayer
}

const ModelMap: Record<RenderPattern, CompoundModelCode> = {
  [RenderPattern.FILL]: [],
  [RenderPattern.FLOOR]: [StaticModelCode.Tile],
  [RenderPattern.STAIR]: [DynamicModelCode.BoxTop],
}

const convertToModel = (renderPattern: RenderPattern): CompoundModelCode => {
  return ModelMap[renderPattern]
}
