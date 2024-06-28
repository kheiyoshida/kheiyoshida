import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import { CompoundRenderModel, ModelGrid, ModelGridLayer, DynamicModelCode } from '../types'

export const convertToBoxesModelGrid = (renderGrid: RenderGrid): ModelGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return modelGrid
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelGridLayer => {
  return renderLayer.map(convertToModel) as ModelGridLayer
}

const ModelMap: Record<RenderPattern, CompoundRenderModel> = {
  [RenderPattern.FILL]: [DynamicModelCode.BoxTop, DynamicModelCode.BoxMiddle, DynamicModelCode.BoxBottom],
  [RenderPattern.FLOOR]: [DynamicModelCode.BoxTop, DynamicModelCode.BoxBottom],
  [RenderPattern.STAIR]: [DynamicModelCode.BoxStair, DynamicModelCode.BoxTop],
}

const convertToModel = (renderPattern: RenderPattern): CompoundRenderModel => {
  return ModelMap[renderPattern]
}
