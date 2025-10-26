import { makeDecreasingParameter } from '../utils/params.ts'
import { game } from '../../../game'

export type EffectParams = {
  fogLevel: number
}
// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 2500, 1000)
export const getEffectParams = (): EffectParams => {
  return {
    fogLevel: visibilityParam(game.player.status.stamina),
  }
}
