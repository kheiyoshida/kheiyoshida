import { ObjectAlignmentValue } from '../../../../domain/translate'
import { DynamicModel, UnitSpec } from '../../unit'
import { Scaffold } from '../../scaffold'
import { convertDynamicModelsToDrawables } from './dynamic'
import { staticObjectEmitterPool } from './static'
import { DrawableObject } from './types'

export const finaliseModelsAsDrawables = (
  models: UnitSpec[],
  scaffold: Scaffold,
  alignment: ObjectAlignmentValue
): DrawableObject[] => {
  return models.flatMap((model) => convertDynamicModelsToDrawables(model as DynamicModel, scaffold))
}

export const eraseGeometriesInMemory = () => {
  staticObjectEmitterPool.reset()
}
