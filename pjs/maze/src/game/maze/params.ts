import { clamp, randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { MaxFloorSize } from '../../config'
import {
  BuildMazeGridParams,
  StairPositionConstraint,
  StartPositionConstraint,
} from '../../core/level/builder'
import { StructureContext } from '../world/types.ts'

export const paramBuild = (level: number, structureContext: StructureContext): BuildMazeGridParams => {
  const size = getLevelSize(level)
  const fillRate = getFillRate(level)
  const connRate = getConnectionRate(level)
  return {
    size,
    fillRate,
    connRate,
    stairPositionConstraint: getStairConstraint(structureContext),
    startPositionConstraint: getStartPositionConstraint(structureContext),
  }
}

export const InitialSize = 12

const getLevelSize = (floor: number): number => {
  if (floor < MaxFloorSize - InitialSize) {
    return randomIntInclusiveBetween(InitialSize, InitialSize + floor * 2)
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

const getStairConstraint = (ctx: StructureContext): StairPositionConstraint => {
  if (ctx.current === 'poles' && ctx.next === 'poles') return 'deadEnd'
  return 'deadEnd'
}

const getStartPositionConstraint = (ctx: StructureContext): StartPositionConstraint => {
  if (ctx.prev !== ctx.current) return 'evenPositionCellExceptStair'
  return 'shouldFaceCorridorWall'
}
