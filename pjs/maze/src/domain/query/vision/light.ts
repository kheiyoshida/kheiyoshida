import { Level } from '../utils/types.ts'
import { store } from '../../../store'
import { clamp } from 'utils'

export type LightVariables = {
  nearVisibility: Level
}

export const getLightColorIntention = (): LightVariables => {
  const floor = store.current.floor

  return {
    // decrease visibility as the game progresses
    nearVisibility: clamp(4 / floor, 0, 1),
  }
}
