import { connect } from './connect.ts'
import { MazeLevel, getCorridorBlocks, getDeadEndBlocks } from '../level.ts'
import { initializeEmptyMatrix, seedNodes } from './seed.ts'

export type MazeLevelParams = [size: number, fillRate: number, connRate: number]

export const buildMatrix = (params: MazeLevelParams, retry = 0): MazeLevel => {
  const matrix = _buildMatrix(...params)
  if (!isValidMazeLevel(matrix)) {
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

const isValidMazeLevel = (level: MazeLevel) => {
  const deadEnds = getDeadEndBlocks(level)
  if (!deadEnds.length) return false
  const corridorNodes = getCorridorBlocks(level)
  if (!corridorNodes.length) return false
  return true
}

const adjustParams = ([size, fill, conn]: MazeLevelParams): MazeLevelParams => {
  return [size + 1, fill * 1.05, conn]
}
