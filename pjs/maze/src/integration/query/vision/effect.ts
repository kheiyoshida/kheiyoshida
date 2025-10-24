import { makeDecreasingParameter } from '../utils/params.ts'
import { player } from '../../../game/setup'

export type EffectParams = {
  fogLevel: number
}
// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 2500, 1000)
export const getEffectParams = (): EffectParams => {
  return {
    fogLevel: visibilityParam(player.status.stamina),
  }
}
