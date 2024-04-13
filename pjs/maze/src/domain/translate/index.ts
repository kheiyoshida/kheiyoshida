import { toFloatPercent } from 'utils'
import { statusStore, store } from '../../store'
import { createDecreasingParameter, createIncreasingParameter } from './utils/params'

export const getRenderingSpeedFromCurrentState = () => {
  return toFloatPercent(statusStore.current.stamina)
}

export const getVisibilityFromCurrentState = (): number => {
  const floor = store.current.floor
  if (floor < 5) return toFloatPercent(statusStore.current.stamina)
  return Math.max(0.1, toFloatPercent(statusStore.current.stamina - floor))
}

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

const calcWidthLevel = createDecreasingParameter(0.1, 1, 75)
const calcHeightLevel = createIncreasingParameter(1, 5, 100)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 75)
const calcDistortion = createIncreasingParameter(0.05, 1, 80)
