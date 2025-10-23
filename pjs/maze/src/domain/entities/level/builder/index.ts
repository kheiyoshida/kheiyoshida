import { MazeLevelParams } from '../index.ts'
import { MazeGrid } from '../grid.ts'

const BuildRetryLimit = 20

export const buildMazeGrid = (params: MazeLevelParams, retry = 0): MazeGrid => {
  const level = _buildMazeLevel(...params)
  if (!isValidMazeLevel(level)) {
    if (retry < BuildRetryLimit) return buildMazeGrid(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }
  return level
}

const _buildMazeLevel = (...[size, fillRate, connRate]: MazeLevelParams): MazeGrid => {
  // init
  const grid = new MazeGrid(size, size)

  // seed

  // connect

  return grid
}

const isValidMazeLevel = (grid: MazeGrid) => {
  const deadEnds = grid.getDeadEnds()
  if (!deadEnds.length) return false
  const corridorNodes = grid.getCorridors()
  if (!corridorNodes.length) return false
  return true
}

const adjustParams = ([size, fill, conn]: MazeLevelParams): MazeLevelParams => {
  return [size + 1, fill * 1.05, conn]
}
