import { fireByRate } from 'utils'
import { Matrix, countMatrixNodes, putNode } from './matrix'
import { iteratePosition } from './iterate'

export const initializeEmptyMatrix = (size: number): Matrix =>
  Array.from(Array(size), () => new Array(size).fill(null))

export const seedNodes = (matrix: Matrix, fillRate: number, maxNodes = 100, r = 0): Matrix => {
  const resultMatrix = _seedNodes(matrix, fillRate, maxNodes)
  if (r > 50) {
    throw Error(`matrix couldn't be filled enough. consider setting higher fillRate`)
  }
  if (countMatrixNodes(resultMatrix) <= 2) {
    return seedNodes(matrix, fillRate + 0.05, maxNodes, r + 1)
  }
  return resultMatrix
}

const _seedNodes = (matrix: Matrix, fillRate: number, maxNodes = 100) => {
  let numOfNodes = 0
  iteratePosition(matrix, (matrix, pos) => {
    if (fireByRate(fillRate)) {
      numOfNodes += 1
      if (numOfNodes <= maxNodes) {
        putNode(matrix, pos)
      } else {
        return true // break loop
      }
    }
    return false
  })
  return matrix
}
