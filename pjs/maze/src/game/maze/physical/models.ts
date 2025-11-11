import { ModelCode } from 'maze-models'
import { randomIntInclusiveBetween } from 'utils'

export type ModelId = {
  code: ModelCode
  variant?: number
}

export const getVariant = (modelCode: ModelCode) => randomIntInclusiveBetween(0, 2)
