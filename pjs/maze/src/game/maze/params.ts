import { clamp, randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { MazeLevelParams } from '../../core/level/legacy'
import { MaxFloorSize } from '../../config'

export const paramBuild = (floor: number): MazeLevelParams => {
  const size = getFloorSize(floor)
  const fill = getFillRate(floor)
  const conn = getConnectionRate(floor)
  return [size, fill, conn]
}

export const InitialFloorSize = 6

const getFloorSize = (floor: number): number => {
  if (floor < MaxFloorSize - InitialFloorSize) {
    return randomIntInclusiveBetween(InitialFloorSize, InitialFloorSize + floor)
  } else {
    return randomIntInclusiveBetween(MaxFloorSize - 4, MaxFloorSize)
  }
}

const DefaultFillRate = 0.44
const MaxFillRate = 0.88

const getFillRate = (floor: number): number => {
  if (floor % 10 === 0) return 0.25
  if (floor % 5 === 0) return 0.75
  if (floor < 5) {
    const min = {
      1: 0.1,
      2: 0.24,
      3: 0.3,
      4: 0.42,
    }[floor]!
    return randomFloatBetween(min, min + 0.2)
  }
  return Math.min(randomFloatBetween(DefaultFillRate - floor / 100, DefaultFillRate), MaxFillRate)
}

const DefaultConnectionRate = 0.5

const getConnectionRate = (floor: number): number => {
  if (floor % 5 === 0) return 0.88
  if (floor < 5) return 0.25 + floor * 0.05
  else
    return clamp(
      randomFloatBetween(DefaultConnectionRate - 0.2, DefaultConnectionRate + 0.1 + floor / 100),
      0.3,
      0.8
    )
}
