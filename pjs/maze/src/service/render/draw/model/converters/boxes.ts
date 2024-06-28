import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import { CompoundModelCode, ModelCodeGrid, ModelCodeGridLayer, DynamicModelCode } from '../types'

export const convertToBoxesModelGrid = (renderGrid: RenderGrid): ModelCodeGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return modelGrid
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelCodeGridLayer => {
  return renderLayer.map(convertToModel) as ModelCodeGridLayer
}

const ModelMap: Record<RenderPattern, CompoundModelCode> = {
  [RenderPattern.FILL]: [DynamicModelCode.BoxTop, DynamicModelCode.BoxMiddle, DynamicModelCode.BoxBottom],
  [RenderPattern.FLOOR]: [DynamicModelCode.BoxTop, DynamicModelCode.BoxBottom],
  [RenderPattern.STAIR]: [DynamicModelCode.BoxStair, DynamicModelCode.BoxTop],
}

const convertToModel = (renderPattern: RenderPattern): CompoundModelCode => {
  return ModelMap[renderPattern]
}
