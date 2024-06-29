import { RenderModel } from '../model'
import { Scaffold } from '../scaffold'
import { convertDynamicModelsToDrawables } from './dynamic'
import { convertStaticModelsToDrawables } from './static'
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
