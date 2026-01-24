import { Level } from '../utils/types.ts'
import { getWalkSpeedFromCurrentState } from './speed.ts'
import { getStairAnimation, StairAnimation } from './stairs.ts'

export type Movement = {
  speed: Level
  stairAnimation: StairAnimation
}

export const getMovement = (): Movement => ({
  speed: getWalkSpeedFromCurrentState(),
  stairAnimation: getStairAnimation(),
})
