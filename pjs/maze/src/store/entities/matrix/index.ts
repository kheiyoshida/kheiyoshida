import { connect } from './connect'
import { MazeLevel, getCorridorBlocks, getDeadEndBlocks } from './matrix'
import { initializeEmptyMatrix, seedNodes } from './seed'

export type MazeLevelParams = [size: number, fillRate: number, connRate: number]

export const buildMatrix = (params: MazeLevelParams, retry = 0): MazeLevel => {
  const matrix = _buildMatrix(...params)
  if (!isValidMatrix(matrix)) {
    if (retry < 20) return buildMatrix(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }
  return matrix
}

const _buildMatrix = (...[size, fillRate, connRate]: MazeLevelParams): MazeLevel => {
  const matrix = initializeEmptyMatrix(size)
  seedNodes(matrix, fillRate)
  connect(matrix, connRate)
  return matrix
}

const isValidMatrix = (matrix: MazeLevel) => {
  const deadEnds = getDeadEndBlocks(matrix)
  if (!deadEnds.length) return false
  const corridorNodes = getCorridorBlocks(matrix)
  if (!corridorNodes.length) return false
  return true
}

const adjustParams = ([size, fill, conn]: MazeLevelParams): MazeLevelParams => {
  return [size + 1, fill * 1.05, conn]
}
