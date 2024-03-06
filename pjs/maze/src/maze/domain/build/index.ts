import { Direction } from '../maze/direction'
import { Matrix } from '../matrix'
import { connect } from './connect'
import { BuildError, finalize } from './finalize'
import { adjustParams, paramBuild } from './params'
import { initializeEmptyMatrix, seedNodes } from './seed'

export type FinalMaze = {
  initialDir: Direction
  matrix: Matrix
  initialPos: number[]
  stairPos: number[]
}

export type BuildParams = Parameters<typeof buildMatrix>

export const buildMaze = (floor: number): FinalMaze => {
  const params = paramBuild(floor)
  return _buildMaze(params)
}

export const _buildMaze = (params: BuildParams, retry = 0): FinalMaze => {
  try {
    const matrix = buildMatrix(...params)
    return finalize(matrix)
  } catch (e) {
    if (e instanceof BuildError) {
      if (retry < 20) return _buildMaze(adjustParams(params), retry + 1)
      else throw Error(`max retry exceeded`)
    } else throw e
  }
}

/**
 * build matrix using parameters to adjust
 *
 * @param size size of matrix
 * @param fillRate rate that detemines each cell should be filled with node
 * @param connRate rate that detemines if adjacent nodes connects to each other
 * @returns matrix array
 */
export const buildMatrix = (size: number, fillRate: number, connRate: number): Matrix => {
  const matrix = initializeEmptyMatrix(size)
  seedNodes(matrix, fillRate)
  connect(matrix, connRate)
  return matrix
}
