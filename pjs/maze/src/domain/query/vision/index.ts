import { getLightColorIntention, LightVariables } from './light.ts'
import { EffectParams, getEffectParams } from './effect.ts'
import { ColorParams } from './color/types.ts'
import { getColorParams } from './color'
import { RenderingMode } from '../../entities/maze/stages'
import { getScreenEffectParams, ScreenEffectParams } from './screenEffect.ts'
import { maze } from '../../setup'

export type { ScreenEffectParams } from './screenEffect.ts'
export type { ColorParams, EffectParams, LightVariables }

export type Vision = {
  light: LightVariables
  effectParams: EffectParams
  color: ColorParams
  mode: RenderingMode
  screenEffectParams: ScreenEffectParams
}

export const getVision = (): Vision => ({
  light: getLightColorIntention(),
  effectParams: getEffectParams(),
  color: getColorParams(),
  mode: maze.getStageContext().current.mode,
  screenEffectParams: getScreenEffectParams(),
})
