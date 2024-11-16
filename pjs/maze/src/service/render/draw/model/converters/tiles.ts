import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import { CompoundModelCode, ModelCodeGrid, ModelCodeGridLayer, StaticModelCode } from '../types'

export const tiles = (renderGrid: RenderGrid): ModelCodeGrid => {
  return renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
}

const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelCodeGridLayer => {
  return renderLayer.map(convertToModel) as ModelCodeGridLayer
}

const ModelMap: Record<RenderPattern, CompoundModelCode> = {
  [RenderPattern.FILL]: [],
  [RenderPattern.FLOOR]: [StaticModelCode.Tile],
  [RenderPattern.STAIR]: [StaticModelCode.Tile, StaticModelCode.Octahedron],
}

const convertToModel = (renderPattern: RenderPattern): CompoundModelCode => {
  return ModelMap[renderPattern]
}
