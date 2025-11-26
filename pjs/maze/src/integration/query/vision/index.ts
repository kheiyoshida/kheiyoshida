import { getLightColorIntention, LightVariables } from './light.ts'
import { EffectParams, getEffectParams } from './effect.ts'
import { ColorParams } from './color/types.ts'
import { getColorParams } from './color'
import { getScreenEffectParams, ScreenEffectParams } from './screenEffect.ts'
import { Atmosphere } from '../../../game/world'

export type { ScreenEffectParams } from './screenEffect.ts'
export type { ColorParams, EffectParams, LightVariables }

export type Vision = {
  light: LightVariables
  effectParams: EffectParams
  color: ColorParams
  mode: Atmosphere
  screenEffectParams: ScreenEffectParams
}

export const getVision = (): Vision => ({
  light: getLightColorIntention(),
  effectParams: getEffectParams(),
  color: getColorParams(),
  // mode: game.maze.currentWorld!.atmosphere ?? Atmosphere.atmospheric,
  mode: Atmosphere.digital,
  screenEffectParams: getScreenEffectParams(),
})
