import { connect } from './connect'
import { Matrix, getCorridorNodes, getDeadendNodes } from './matrix'
import { initializeEmptyMatrix, seedNodes } from './seed'

export type BuildMatrixParams = [size: number, fillRate: number, connRate: number]

export const buildMatrix = (params: BuildMatrixParams, retry = 0): Matrix => {
  const matrix = _buildMatrix(...params)
  if (!isValidMatrix(matrix)) {
    if (retry < 20) return buildMatrix(adjustParams(params), retry + 1)
    else throw Error(`could not build valid matrix`)
  }
  return matrix
}

const _buildMatrix = (...[size, fillRate, connRate]: BuildMatrixParams): Matrix => {
  const matrix = initializeEmptyMatrix(size)
  seedNodes(matrix, fillRate)
  connect(matrix, connRate)
  return matrix
}

const isValidMatrix = (matrix: Matrix) => {
  const deadEnds = getDeadendNodes(matrix)
  if (!deadEnds.length) return false
  const corridorNodes = getCorridorNodes(matrix)
  if (!corridorNodes.length) return false
  return true
}

const adjustParams = ([size, fill, conn]: BuildMatrixParams): BuildMatrixParams => {
  return [size + 1, fill * 1.05, conn]
}
