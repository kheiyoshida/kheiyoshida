
import { makeDecreasingParameter } from '../utils/params.ts'
import { MAX_STATUS_VALUE } from '../../../config'
import { game } from '../../../game'

export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(game.player.status.stamina)
}

const calcSpeed = makeDecreasingParameter(0, 1, (MAX_STATUS_VALUE * 3) / 4, MAX_STATUS_VALUE / 4)
