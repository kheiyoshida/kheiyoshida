import { Level } from '../types.ts'
import { statusStore, store } from '../../../store'
import { makeDecreasingParameter } from '../utils/params.ts'
import { clamp } from 'utils'

export type LightVariables = {
  nearVisibility: Level
  farVisibility: Level
}

// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 2500, 300)

export const getLightColorIntention = (): LightVariables => {
  const floor = store.current.floor
  const stamina = statusStore.current.stamina

  return {
    // decrease visibility as the game progresses
    nearVisibility: clamp(4 / floor, 0, 1),

    farVisibility: visibilityParam(stamina),
  }
}
