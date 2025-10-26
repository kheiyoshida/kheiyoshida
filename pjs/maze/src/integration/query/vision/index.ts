import { getLightColorIntention, LightVariables } from './light.ts'
import { EffectParams, getEffectParams } from './effect.ts'
import { ColorParams } from './color/types.ts'
import { getColorParams } from './color'
import { RenderingMode } from '../../../game/stage'
import { getScreenEffectParams, ScreenEffectParams } from './screenEffect.ts'
import { game } from '../../../game'

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
  mode: game.maze.getStageContext().current.mode,
  screenEffectParams: getScreenEffectParams(),
})
