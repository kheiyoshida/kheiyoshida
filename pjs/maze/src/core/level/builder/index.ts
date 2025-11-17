import { MazeGrid } from '../grid.ts'
import { seedCells } from './seed.ts'
import { connectCells } from './connect.ts'
import { fireByRate, randomItemFromArray } from 'utils'
import { getTurnedDirection } from '../../grid/direction.ts'

const BuildRetryLimit = 20

export type BuildMazeGridParams = {
  size: number
  fillRate: number
  connRate: number
  stairPositionConstraint: StairPositionConstraint
  startPositionConstraint: StartPositionConstraint
}

export type StairPositionConstraint = 'deadEnd' | 'horizontalExit'
export type StartPositionConstraint = 'evenPositionCellExceptStair' | 'shouldFaceCorridorWall'

export const buildMazeGrid = (params: BuildMazeGridParams, retry = 0): MazeGrid => {
  const grid = _buildMazeGrid(params)

  if (!isValidMazeLevel(grid)) {
    if (retry < BuildRetryLimit) return buildMazeGrid(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }

  // set stair
  const deadEndPos = randomItemFromArray(grid.getDeadEnds())
  grid.get(deadEndPos)!.type = 'stair'

  // set start
  console.log(params.startPositionConstraint)
  const startPos = randomItemFromArray(grid.getCorridors())
  const dir = grid.getCorridorDir(startPos)!
  grid.get(startPos)!.start = { direction: getTurnedDirection(fireByRate(0.5) ? 'right' : 'left', dir) }

  return grid
}

const _buildMazeGrid = ({ size, fillRate, connRate }: BuildMazeGridParams): MazeGrid => {
  const grid = new MazeGrid(size, size)
  seedCells(grid, fillRate)
  connectCells(grid, connRate)
  return grid
}

const isValidMazeLevel = (grid: MazeGrid) => {
  const deadEnds = grid.getDeadEnds()
  if (!deadEnds.length) return false
  const corridorNodes = grid.getCorridors()
  if (!corridorNodes.length) return false
  return true
}

const adjustParams = (params: BuildMazeGridParams): BuildMazeGridParams => {
  return {
    ...params,
    size: params.size + 1,
    fillRate: params.fillRate * 1.05,
  }
}
