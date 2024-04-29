import { statusStore } from '../../store'
import { createDecreasingParameter, createIncreasingParameter } from './utils/params'

export type ScaffoldParams = {
  corridorWidthLevel: number
  wallHeightLevel: number
  corridorLengthLevel: number
  distortionLevel: number
}

export const getScaffoldParams = (): ScaffoldParams => {
  const { stamina, sanity } = statusStore.current
  const params = {
    corridorWidthLevel: calcWidthLevel(sanity),
    wallHeightLevel: calcHeightLevel(sanity / 2 + stamina),
    corridorLengthLevel: calcCorridorLengthLevel(stamina),
    distortionLevel: calcDistortion(sanity),
  }
  return params
}

const calcWidthLevel = createDecreasingParameter(0.2, 1, 75)
const calcHeightLevel = createIncreasingParameter(1, 5, 100)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 75)
const calcDistortion = createIncreasingParameter(0.05, 1, 125)

export const getWalkSpeedFromCurrentState = () => {
  return calcSpeed(statusStore.current.stamina)
}

const calcSpeed = createDecreasingParameter(0, 1, 80)
