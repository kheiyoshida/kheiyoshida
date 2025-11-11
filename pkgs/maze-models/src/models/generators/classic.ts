import { ClassicModelCode } from '../code'
import { GeometrySpec, Vector3D } from '../../pipeline/types'
import { BaseGeometryMap } from '../base'
import { defaultModifier, ModifierParams } from '../modifiers'
import { randomIntInclusiveBetween } from 'utils'

export const generateClassicModel = (code: ClassicModelCode): GeometrySpec => {
  const base = BaseGeometryMap[code]
  const params: ModifierParams = { tesselation: randomIntInclusiveBetween(2, 5), deform: classicDeform }
  return defaultModifier(params)(base)
}

const isBoxCorner = (v: Vector3D): boolean => {
  return v.map(Math.abs).every((val) => val === 1)
}

const classicDeform = (v: Vector3D): Vector3D => {
  if (isBoxCorner(v)) return v

  return [
    v[0] + (Math.random() - 0.5) * 0.8,
    v[1] + (Math.random() - 0.5) * 0.8,
    v[2] + (Math.random() - 0.5) * 0.8,
  ]
}
