import { BuildMatrixParams, buildMatrix } from '../../store/entities/matrix'
import { Matrix } from '../../store/entities/matrix/matrix'
import { Direction } from '../maze/direction'
import { BuildError, finalize } from './finalize'
import { adjustParams, paramBuild } from './params'

export type FinalMaze = {
  initialDir: Direction
  matrix: Matrix
  initialPos: number[]
  stairPos: number[]
}

export type BuildParams = BuildMatrixParams

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

