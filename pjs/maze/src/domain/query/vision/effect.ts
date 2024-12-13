import { makeDecreasingParameter } from '../utils/params.ts'
import { statusStore } from '../../../store'

export type EffectParams = {
  fogLevel: number
}
// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 2500, 1000)
export const getEffectParams = (): EffectParams => {
  return {
    fogLevel: visibilityParam(statusStore.current.stamina),
  }
}
