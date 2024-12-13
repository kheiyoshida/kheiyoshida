import { Level } from '../utils/types.ts'
import { getWalkSpeedFromCurrentState } from './speed.ts'

export type Movement = {
  speed: Level
}

export const getMovement = (): Movement => ({
  speed: getWalkSpeedFromCurrentState()
})
