import { randomFloatBetween } from 'utils'
import { RenderModel } from '../model'
import { Scaffold } from '../scaffold'
import { convertDynamicModelsToDrawables } from './dynamic'
import { convertStaticModelsToDrawables, staticObjectEmitterPool } from './static'
import { DrawableObject } from './types'

export const finaliseModelsAsDrawables = (
  models: RenderModel[],
  scaffold: Scaffold
): DrawableObject[] => {
  return models.flatMap((model) => {
    if (model.type === 'dynamic') {
      return convertDynamicModelsToDrawables(model, scaffold)
    } else {
      return convertStaticModelsToDrawables(model, scaffold)
    }
  })
}

export const updateStaticModelLevels = () => {
  const delta = randomFloatBetween(-0.3, 0.3)
  staticObjectEmitterPool.updateLevel(delta)
  staticObjectEmitterPool.recalculate()
}

export const eraseGeometriesInMemory = () => {
  staticObjectEmitterPool.reset()
}
