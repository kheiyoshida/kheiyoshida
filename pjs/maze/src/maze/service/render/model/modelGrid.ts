import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../domain/compose/renderSpec'
import { CompoundRenderModel, ModelGrid, ModelGridLayer, RenderModel } from './types'

export const convertToModelGrid = (renderGrid: RenderGrid): ModelGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  // TODO: omit the unnecessary models here
  return modelGrid
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelGridLayer => {
  const modelLayer = renderLayer.map(convertToModel) as ModelGridLayer
  // TODO: omit the unnecessary models here
  return modelLayer
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
