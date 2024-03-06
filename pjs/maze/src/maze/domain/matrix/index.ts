import { connect } from "./connect"
import { initializeEmptyMatrix, seedNodes } from "./seed"
import { Matrix } from "./matrix"

export type BuildMatrixParams = [size: number, fillRate: number, connRate: number]

/**
 * build matrix using parameters to adjust
 *
 * @param size size of matrix
 * @param fillRate rate that detemines each cell should be filled with node
 * @param connRate rate that detemines if adjacent nodes connects to each other
 * @returns matrix array
 */
export const buildMatrix = (...[size, fillRate, connRate]: BuildMatrixParams): Matrix => {
  const matrix = initializeEmptyMatrix(size)
  seedNodes(matrix, fillRate)
  connect(matrix, connRate)
  return matrix
}
