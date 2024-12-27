import { Level } from '../utils/types.ts'
import { clamp } from 'utils'
import { maze } from '../../setup'

export type LightVariables = {
  nearVisibility: Level
}

export const getLightColorIntention = (): LightVariables => {
  return {
    // decrease visibility as the game progresses
    nearVisibility: clamp(4 / maze.currentFloor, 0, 1),
  }
}
