import { ModelCode } from './code'
import { GeometrySpec } from '../pipeline/types'
import { BaseGeometryMap } from './base'

export type { ModelCode } from './code'

export const generateGeometry = (modelCode: ModelCode): GeometrySpec => {
  return BaseGeometryMap[modelCode]
}
