import { MazeGrid } from '../grid.ts'
import { seedCells } from './seed.ts'
import { connectCells } from './connect.ts'
import { setStairMethods, setStartMethods } from './extras.ts'

const BuildRetryLimit = 20

export type BuildMazeGridParams = {
  size: number
  fillRate: number
  connRate: number
  stairPositionConstraint: StairPositionConstraint
  startPositionConstraint: StartPositionConstraint
}

export type StairPositionConstraint = 'deadEnd' | 'exit'
export type StartPositionConstraint = 'evenPositionCellExceptStair' | 'shouldFaceCorridorWall'

export class BuildMazeGridError extends Error {}

export const buildMazeGrid = (params: BuildMazeGridParams, retry = 0): MazeGrid => {
  const { size, fillRate, connRate } = params
  const grid = new MazeGrid(size, size)
  seedCells(grid, fillRate)
  connectCells(grid, connRate)

  try {
    setStairMethods[params.stairPositionConstraint](grid)
    setStartMethods[params.startPositionConstraint](grid)
  } catch (e) {
    if (retry < BuildRetryLimit) return buildMazeGrid(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }

  return grid
}

const adjustParams = (params: BuildMazeGridParams): BuildMazeGridParams => {
  return {
    ...params,
    size: params.size + 1, // TODO: level gets too big
  }
}
