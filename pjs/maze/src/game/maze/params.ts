import { clamp, randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { MaxFloorSize } from '../../config'
import { BuildMazeGridParams } from '../../core/level/builder'
import { StructureContext } from '../world/types.ts'
import { getStairSpec } from './stair.ts'

export const paramBuild = (level: number, structureContext: StructureContext): BuildMazeGridParams => {
  const size = getLevelSize(level)
  const fillRate = getFillRate(level)
  const connRate = getConnectionRate(level)
  const stairSpec = getStairSpec(structureContext)
  return {
    size,
    fillRate,
    connRate,
    stairPositionConstraint: stairSpec.position,
    startPositionConstraint: 'shouldFaceCorridorWall',
  }
}

export const InitialSize = 9

const oddize = (n: number) => n % 2 === 0 ? n - 1 : n

const getLevelSize = (floor: number): number => {
  if (floor < MaxFloorSize - InitialSize) {
    return oddize(randomIntInclusiveBetween(InitialSize, InitialSize + floor))
  } else {
    return oddize(randomIntInclusiveBetween(MaxFloorSize - 8, MaxFloorSize))
  }
}

const DefaultFillRate = 0.4
const MaxFillRate = 0.66

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
  if (floor < 5) return 0.25 + floor * 0.05
  else
    return clamp(
      randomFloatBetween(DefaultConnectionRate - 0.2, DefaultConnectionRate + 0.1 + floor / 100),
      0.3,
      0.8
    )
}
