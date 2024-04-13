import { toFloatPercent } from 'utils'
import { statusStore } from '../../store'
import { createDecreasingParameter, createIncreasingParameter } from './utils/params'

/**
 * @returns 0.0x ~ 1.0x
 */
export const getRenderingSpeedFromCurrentState = () => {
  return toFloatPercent(statusStore.current.stamina)
}

export const getVisibilityFromCurrentState = () => {
  return toFloatPercent(statusStore.current.stamina)
}

export type ScaffoldParams = {
  corridorWidthLevel: number
  wallHeightLevel: number
  corridorLengthLevel: number
  distortionLevel: number
}

export const getScaffoldParams = (): ScaffoldParams => {
  const { stamina, sanity } = statusStore.current
  return {
    corridorWidthLevel: calcWidthLevel(sanity),
    wallHeightLevel: calcHeightLevel(sanity + stamina),
    corridorLengthLevel: calcCorridorLengthLevel(stamina),
    distortionLevel: calcDistortion(sanity),
  }
}

const calcWidthLevel = createDecreasingParameter(0.44, 1, 90)
const calcHeightLevel = createIncreasingParameter(1, 3, 100)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 80)
const calcDistortion = createIncreasingParameter(0, 1, 100)
