import { fireByRate } from 'utils'
import { MazeLevel } from '../level.ts'
import { countMatrixNodes, iterateByPosition } from '../../utils/matrix.ts'
import { putBlock } from './path.ts'

export const seedNodes = (matrix: MazeLevel, fillRate: number, maxNodes = 100, r = 0): MazeLevel => {
  const resultMatrix = _seedNodes(matrix, fillRate, maxNodes)
  if (r > 50) {
    throw Error(`matrix couldn't be filled enough. consider setting higher fillRate`)
  }
  if (countMatrixNodes(resultMatrix) <= 2) {
    return seedNodes(matrix, fillRate + 0.05, maxNodes, r + 1)
  }
  return resultMatrix
}

const _seedNodes = (matrix: MazeLevel, fillRate: number, maxNodes = 100) => {
  let numOfNodes = 0
  iterateByPosition(matrix, (matrix, pos) => {
    if (fireByRate(fillRate)) {
      numOfNodes += 1
      if (numOfNodes <= maxNodes) {
        putBlock(matrix, pos)
      } else {
        return true // break loop
      }
    }
    return false
  })
  return matrix
}
