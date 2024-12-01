import { Level } from '../types.ts'
import { statusStore, store } from '../../../store'
import { makeDecreasingParameter } from '../utils/params.ts'
import { clamp } from 'utils'

export type LightVariables = {
  nearVisibility: Level
  farVisibility: Level
}

// decrease visibility when stamina is low
const nearVisibilityParameter = makeDecreasingParameter(0, 1, 1500)

export const getLightColorIntention = (): LightVariables => {
  const floor = store.current.floor
  const stamina = statusStore.current.stamina

  return {
    nearVisibility: nearVisibilityParameter(stamina),

    // decrease far visibility as the game progresses
    farVisibility: clamp(4 / floor, 0, 1),
  }
}
