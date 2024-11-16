import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import {
  CompoundModelCode,
  DynamicModelCode,
  ModelCodeGrid,
  ModelCodeGridLayer,
  StaticModelCode,
} from '../types'

export const convertToBoxesModelGrid = (renderGrid: RenderGrid): ModelCodeGrid => {
  return renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelCodeGridLayer => {
  return renderLayer.map(convertToModel) as ModelCodeGridLayer
}

const ModelMap: Record<RenderPattern, CompoundModelCode> = {
  [RenderPattern.FILL]: [DynamicModelCode.Floor, StaticModelCode.Pole],
  [RenderPattern.FLOOR]: [DynamicModelCode.Floor],
  [RenderPattern.STAIR]: [DynamicModelCode.Floor, StaticModelCode.Octahedron],
}

const convertToModel = (renderPattern: RenderPattern): CompoundModelCode => {
  return ModelMap[renderPattern]
}
