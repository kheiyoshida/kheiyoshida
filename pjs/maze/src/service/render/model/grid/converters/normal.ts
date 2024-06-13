import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import { CompoundRenderModel, ModelGrid, ModelGridLayer, RenderModel } from '../../types'

export const convertToNormalModelGrid = (renderGrid: RenderGrid): ModelGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return trimModelsVertical(modelGrid)
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelGridLayer => {
  const modelLayer = renderLayer.map(convertToModel) as ModelGridLayer
  return trimModelsHorizontal(modelLayer)
}

export const convertToModel = (
  renderPattern: RenderPattern,
  position: RenderPosition
): CompoundRenderModel => {
  if (position === RenderPosition.CENTER) return convertCenterModel(renderPattern)
  else return convertSideModel(renderPattern)
}

export const convertCenterModel = (pattern: RenderPattern): CompoundRenderModel => {
  if (pattern === RenderPattern.FLOOR) return [RenderModel.Floor, RenderModel.Ceil]
  if (pattern === RenderPattern.FILL) return [RenderModel.FrontWall]
  if (pattern === RenderPattern.STAIR) return [RenderModel.Stair, RenderModel.StairCeil]
  throw Error()
}

export const convertSideModel = (pattern: RenderPattern): CompoundRenderModel => {
  if (pattern === RenderPattern.FLOOR) return [RenderModel.Floor, RenderModel.Ceil]
  if (pattern === RenderPattern.FILL) return [RenderModel.FrontWall, RenderModel.SideWall]
  throw Error()
}

export const trimModelsVertical = (modelGrid: ModelGrid): ModelGrid => {
  return modelGrid.map((modelLayer, i) => {
    if (i === 0 ) return modelLayer
    return modelLayer.map((compound, position) => {
      if (position === RenderPosition.CENTER) return compound
      if (modelGrid[i-1][position].includes(RenderModel.SideWall)) {
        return compound.filter((model) => model !== RenderModel.FrontWall)
      }
      return compound
    }) as ModelGridLayer
  })
}

export const trimModelsHorizontal = (modelLayer: ModelGridLayer): ModelGridLayer => {
  if (modelLayer.every((compound) => compound.includes(RenderModel.FrontWall))) {
    return modelLayer.map((compound) =>
      compound.filter((model) => model !== RenderModel.SideWall)
    ) as ModelGridLayer
  }
  return modelLayer
}
