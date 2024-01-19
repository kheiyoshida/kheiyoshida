import { random } from "p5utils/src/lib/random"
import { retry } from '../../utils/retry'
import { Matrix, countNodes, putNode } from '../matrix'
import { iteratePosition } from '../matrix/iterate'

/**
 * initialize matrix (size*size) filled with null
 */
export const initMatrix = (size: number): Matrix =>
  Array.from(Array(size), () => new Array(size).fill(null))

/**
 * seed nodes in null-filled matrix
 */
const _seedNodes = (matrix: Matrix, fillRate: number, maxNodes = 100) => {
  let numOfNodes = 0
  iteratePosition(matrix, (matrix, pos) => {
    if (random(fillRate)) {
      numOfNodes += 1
      if (numOfNodes <= maxNodes) {
        putNode(matrix, pos)
      } else {
        return true
      }
    }
    return false
  })
  return matrix
}

/**
 * put nodes in the matrix randomly based on fill rate
 */
export const seedNodes = retry(
  _seedNodes,
  (matrix) => countNodes(matrix) > 2,
  50,
  `matrix couldn't be filled enough. consider setting higher fillRate`,
  (matrix, fillRate, maxNodes) =>
    [matrix, fillRate + 0.05, maxNodes] as Parameters<typeof _seedNodes>
)
