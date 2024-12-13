import { statusStore } from '../../../store'
import { makeDecreasingParameter } from '../utils/params.ts'
import { MAX_STATUS_VALUE } from '../../../config'

export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = makeDecreasingParameter(0, 1, (MAX_STATUS_VALUE * 3) / 4, MAX_STATUS_VALUE / 4)
