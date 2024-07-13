import { randomFloatBetween } from 'utils'
import { RenderModel } from '../model'
import { Scaffold } from '../scaffold'
import { convertDynamicModelsToDrawables } from './dynamic'
import { convertStaticModelsToDrawables, staticObjectEmitterPool } from './static'
import { DrawableObject } from './types'
import { ObjectAlignmentValue } from '../../../../domain/translate'

export const finaliseModelsAsDrawables = (
  models: RenderModel[],
  scaffold: Scaffold,
  alignment: ObjectAlignmentValue
): DrawableObject[] => {
  return models.flatMap((model) => {
    if (model.type === 'dynamic') {
      return convertDynamicModelsToDrawables(model, scaffold)
    } else {
      return convertStaticModelsToDrawables(model, scaffold, alignment)
    }
  })
}

export const eraseGeometriesInMemory = () => {
  staticObjectEmitterPool.reset()
}
