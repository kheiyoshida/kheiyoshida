import { clamp, randomFloatBetween, randomFloatInAsymmetricRange, randomIntInclusiveBetween } from 'utils'
import { MaxFloorSize } from '../../config'
import { BuildMazeGridParams } from '../../core/level/builder'
import { StructureContext } from '../world/types.ts'
import { getStairSpec } from './stair.ts'
import { IWorldState } from '../world/state.ts'

export const paramBuild = (
  level: number,
  structureContext: StructureContext,
  worldState: IWorldState
): BuildMazeGridParams => {
  const size = getLevelSize(level)
  const fillRate = getFillRate(level, worldState.density)
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

const oddize = (n: number) => (n % 2 === 0 ? n - 1 : n)

const getLevelSize = (floor: number): number => {
  if (floor < MaxFloorSize - InitialSize) {
    return oddize(randomIntInclusiveBetween(InitialSize, InitialSize + floor))
  } else {
    return oddize(randomIntInclusiveBetween(MaxFloorSize - 8, MaxFloorSize))
  }
}

const DefaultFillRate = 0.4
const MaxFillRate = 0.66

const getFillRate = (floor: number, density: number): number => {
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
  const scarcity = 1.0 - density
  const rate = randomFloatBetween(
    DefaultFillRate - randomFloatBetween(0, DefaultFillRate) * scarcity,
    MaxFillRate
  )
  if (rate < 0.1) return 0.1
  return rate
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
