import { Level } from '../utils/types.ts'
import { clamp } from 'utils'
import { game } from '../../../game'

export type LightVariables = {
  nearVisibility: Level
}

export const getLightColorIntention = (): LightVariables => {
  return {
    // decrease visibility as the game progresses
    nearVisibility: clamp(4 / game.maze.currentFloor, 0, 1),
  }
}
