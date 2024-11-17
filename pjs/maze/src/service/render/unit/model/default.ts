import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../domain/translate/renderGrid/renderSpec.ts'
import { ModelCode, ModelCodeGrid, ModelCodeGridLayer } from './types.ts'

export const convertToDefaultModelGrid = (renderGrid: RenderGrid): ModelCodeGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return trimModelsVertical(modelGrid)
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelCodeGridLayer => {
  const modelLayer = renderLayer.map(convertToModel) as ModelCodeGridLayer
  return trimModelsHorizontal(modelLayer)
}

export const convertToModel = (
  renderPattern: RenderPattern,
  position: RenderPosition
): ModelCode[] => {
  if (position === RenderPosition.CENTER) return convertCenterModel(renderPattern)
  else return convertSideModel(renderPattern)
}

export const convertCenterModel = (pattern: RenderPattern): ModelCode[] => {
  if (pattern === RenderPattern.FLOOR) return [ModelCode.Floor, ModelCode.Ceil]
  if (pattern === RenderPattern.FILL) return [ModelCode.FrontWall]
  if (pattern === RenderPattern.STAIR) return [ModelCode.Floor, ModelCode.Stair, ModelCode.Ceil]
  throw Error()
}

export const convertSideModel = (pattern: RenderPattern): ModelCode[] => {
  if (pattern === RenderPattern.FLOOR) return [ModelCode.Floor, ModelCode.Ceil]
  if (pattern === RenderPattern.FILL) return [ModelCode.FrontWall, ModelCode.SideWall]
  throw Error()
}

export const trimModelsVertical = (modelGrid: ModelCodeGrid): ModelCodeGrid => {
  return modelGrid.map((modelLayer, i) => {
    if (i === 0) return modelLayer
    return modelLayer.map((compound, position) => {
      if (position === RenderPosition.CENTER) return compound
      if (modelGrid[i - 1][position].includes(ModelCode.SideWall)) {
        return compound.filter((model) => model !== ModelCode.FrontWall)
      }
      return compound
    }) as ModelCodeGridLayer
  })
}

export const trimModelsHorizontal = (modelLayer: ModelCodeGridLayer): ModelCodeGridLayer => {
  if (modelLayer.every((compound) => compound.includes(ModelCode.FrontWall))) {
    return modelLayer.map((compound) =>
      compound.filter((model) => model !== ModelCode.SideWall)
    ) as ModelCodeGridLayer
  }
  return modelLayer
}
