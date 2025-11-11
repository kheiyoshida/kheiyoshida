import { isClassic, ModelCode } from './code'
import { GeometrySpec } from '../pipeline/types'
import { BaseGeometryMap } from './base'
import { generateClassicModel } from './generators/classic'

export type { ModelCode } from './code'

export const generateGeometry = (modelCode: ModelCode): GeometrySpec => {
  if (isClassic(modelCode)) return generateClassicModel(modelCode)

  return BaseGeometryMap[modelCode]
}
