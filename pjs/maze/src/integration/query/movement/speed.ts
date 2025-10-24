
import { makeDecreasingParameter } from '../utils/params.ts'
import { MAX_STATUS_VALUE } from '../../../config'
import { player } from '../../../game/setup'

export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(player.status.stamina)
}

const calcSpeed = makeDecreasingParameter(0, 1, (MAX_STATUS_VALUE * 3) / 4, MAX_STATUS_VALUE / 4)
