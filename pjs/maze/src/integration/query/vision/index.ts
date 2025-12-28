import { getLightColorIntention, LightVariables } from './light.ts'
import { ColorParams } from './color/types.ts'
import { getColorParams } from './color'
import { getEffectParams } from './effect.ts'
import { Atmosphere } from '../../../game/world/types.ts'
import { game } from '../../../game'
import { EffectParams } from 'maze-gl'

export type { ColorParams, LightVariables }

export type Vision = {
  light: LightVariables
  effectParams: EffectParams
  color: ColorParams
  mode: Atmosphere
}

export const getVision = (): Vision => ({
  light: getLightColorIntention(),
  effectParams: getEffectParams(),
  color: getColorParams(),
  mode: game.maze.currentWorld!.atmosphere,
})
