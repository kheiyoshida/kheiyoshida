import { getLightColorIntention, LightVariables } from './light.ts'
import { EffectParams, getEffectParams } from './effect.ts'
import { ColorParams } from './color/types.ts'
import { getColorParams } from './color'

export type { ColorParams, EffectParams, LightVariables }
export type Vision = {
  light: LightVariables
  effectParams: EffectParams
  color: ColorParams
}

export const getVision = (): Vision => ({
  light: getLightColorIntention(),
  effectParams: getEffectParams(),
  color: getColorParams(),
})
