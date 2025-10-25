
import { MazeGrid } from '../grid.ts'
import { seedCells } from './seed.ts'
import { connectCells } from './connect.ts'
import { randomItemFromArray } from 'utils'

const BuildRetryLimit = 20

export type MazeGridParams = [size: number, fillRate: number, connRate: number]

export const buildMazeGrid = (params: MazeGridParams, retry = 0): MazeGrid => {
  const grid = _buildMazeGrid(...params)
  if (!isValidMazeLevel(grid)) {
    if (retry < BuildRetryLimit) return buildMazeGrid(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }

  // set stair
  const deadEndPos = randomItemFromArray(grid.getDeadEnds())
  grid.get(deadEndPos)!.type = 'stair'

  return grid
}

const _buildMazeGrid = (...[size, fillRate, connRate]: MazeGridParams): MazeGrid => {
  // init
  const grid = new MazeGrid(size, size)

  // seed
  seedCells(grid, fillRate)

  // connect
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

const adjustParams = ([size, fill, conn]: MazeGridParams): MazeGridParams => {
  return [size + 1, fill * 1.05, conn]
}
