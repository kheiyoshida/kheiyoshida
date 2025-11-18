import { isClassic, ModelCode } from './code'
import { GeometrySpec } from '../pipeline/types'
import { BaseGeometryMap, getBaseGeometry } from './base'
import { generateClassicModel } from './generators/classic'
import { defaultModifier, ModifierParams } from './modifiers'
import { randomIntInclusiveBetween } from 'utils'

export type { ModelCode } from './code'

export const generateGeometry = (modelCode: ModelCode): GeometrySpec => {
  if (isClassic(modelCode)) return generateClassicModel(modelCode)

  const base = getBaseGeometry(modelCode)
  const params: ModifierParams = {
    tesselation: randomIntInclusiveBetween(1, 2),
    deform: (v) => [
      v[0] + (Math.random() - 0.5) * 0.1,
      v[1] + (Math.random() - 0.5) * 0.1,
      v[2] + (Math.random() - 0.5) * 0.1,
    ],
    computeNormals: 'vertex',
  }
  return defaultModifier(params)(base)
  // return BaseGeometryMap[modelCode]
}
