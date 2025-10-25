import { connect } from './connect.ts'
import { getCorridorBlocks, getDeadEndBlocks, MazeLevel } from '../../../game/maze/legacy/level.ts'
import { seedNodes } from './seed.ts'
import { initializeEmptyMatrix } from '../../_legacy/matrix.ts'

export type MazeLevelParams = [size: number, fillRate: number, connRate: number]

export const buildMazeLevel = (params: MazeLevelParams, retry = 0): MazeLevel => {
  const level = _buildMazeLevel(...params)
  if (!isValidMazeLevel(level)) {
    if (retry < 20) return buildMazeLevel(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }
  return level
}

const _buildMazeLevel = (...[size, fillRate, connRate]: MazeLevelParams): MazeLevel => {
  const matrix = initializeEmptyMatrix<MazeLevel>(size)
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
