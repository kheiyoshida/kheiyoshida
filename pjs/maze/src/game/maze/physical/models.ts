import { ModelCode } from 'maze-models'
import { randomIntInclusiveBetween } from 'utils'

export type ModelId = {
  code: ModelCode
  variant?: number
  length?: number
}

export const getVariant = (modelCode: ModelCode) => randomIntInclusiveBetween(0, 2)
