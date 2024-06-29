import { RenderBlockPosition } from '../scaffold'
import {
  CompoundModelCode,
  DynamicModelCode,
  ModelCode,
  ModelCodeGrid,
  RenderModel,
  StaticModelCode,
  staticModelCodes,
} from './types'

export const injectGridPositionToModels = (grid: ModelCodeGrid): RenderModel[] =>
  grid.flatMap((layer, z) =>
    layer.flatMap((compound, x) => mapPositionToModels(compound, { x, z }))
  )

export const mapPositionToModels = (
  compound: CompoundModelCode,
  position: RenderBlockPosition
): RenderModel[] => compound.map((model) => detectModelType(model, position))

export const detectModelType = (
  modelCode: ModelCode,
  position: RenderBlockPosition
): RenderModel => {
  if (staticModelCodes.includes(modelCode))
    return {
      type: 'static',
      code: modelCode as StaticModelCode,
      position,
    }
  else
    return {
      type: 'dynamic',
      code: modelCode as DynamicModelCode,
      position,
    }
}
