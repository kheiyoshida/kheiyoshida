import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import { CompoundRenderModel, ModelGrid, ModelGridLayer, RenderModel } from '../../types'

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
  [RenderPattern.FILL]: [RenderModel.BoxTop, RenderModel.BoxMiddle, RenderModel.BoxBottom],
  [RenderPattern.FLOOR]: [RenderModel.BoxTop, RenderModel.BoxBottom],
  [RenderPattern.STAIR]: [RenderModel.BoxStair, RenderModel.BoxTop],
}

const convertToModel = (renderPattern: RenderPattern): CompoundRenderModel => {
  return ModelMap[renderPattern]
}