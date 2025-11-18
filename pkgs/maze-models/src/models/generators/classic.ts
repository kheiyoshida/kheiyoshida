import { ClassicModelCode } from '../code'
import { GeometrySpec, Vector3D } from '../../pipeline/types'
import { getBaseGeometry } from '../base'
import { defaultModifier, ModifierParams } from '../modifiers'
import { randomIntInclusiveBetween } from 'utils'

export const generateClassicModel = (code: ClassicModelCode): GeometrySpec => {
  const base = getBaseGeometry(code)
  const params: ModifierParams = {
    tesselation: randomIntInclusiveBetween(1, 3),
    deform: classicDeform,
    computeNormals: 'vertex',
  }
  return defaultModifier(params)(base)
}

const isBoxCorner = (v: Vector3D): boolean => {
  return v.map(Math.abs).every((val) => val === 1)
}

const classicDeform = (v: Vector3D): Vector3D => {
  if (isBoxCorner(v)) return v

  return [
    v[0] + (Math.random() - 0.5) * 0.3,
    v[1] + (Math.random() - 0.5) * 0.3,
    v[2] + (Math.random() - 0.5) * 0.3,
  ]
}
