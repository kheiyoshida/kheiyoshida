import { clamp } from 'utils'
import { statusStore } from '../../store'

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
    distortionLevel: 0,
  }
}

export const createDecreasingParameter =
  (min: number, max: number, threshold: number = 100) =>
  (status: number) => {
    const diff = max - min
    const ratio = status >= threshold ? 1 : status / threshold
    return clamp(min + ratio * diff, min, max)
  }

export const createIncreasingParameter =
  (min: number, max: number, threshold: number = 100) =>
  (status: number) => {
    const diff = max - min
    const ratio = status >= threshold ? 0 : 1 - status / threshold
    return clamp(min + ratio * diff, min, max)
  }

const calcWidthLevel = createDecreasingParameter(0.5, 1, 80)
const calcHeightLevel = createIncreasingParameter(1, 3, 100)
const calcCorridorLengthLevel = createIncreasingParameter(1, 2, 80)
