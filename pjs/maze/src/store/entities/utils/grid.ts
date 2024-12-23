import { Position } from '../../../utils/position.ts'

/**
 * data structure for square matrix.
 * - each item can be null
 */
export type Matrix<Item = unknown> = Array<Array<Item | null>>

/**
 * iterate over each position in the matrix
 * @param matrix
 * @param cb return true when done
 */
export const iterateByPosition = (matrix: Matrix, cb: (matrix: Matrix, position: Position) => boolean) => {
  matrix.every((row, i) => row.every((_, j) => !cb(matrix, [i, j])))
}

/**
 * iterate over each truthy item in the matrix
 */
export const iterateEachItem = <Item>(matrix: Matrix<Item>, cb: (matrix: Matrix<Item>, item: Item) => void) => {
  matrix.forEach((row) =>
    row.forEach((item) => {
      if (item) cb(matrix, item)
    })
  )
}

/**
 * filter nodes in matrix and map
 */
export const filterNodes = <Item>(matrix: Matrix<Item>, p: (node: Item) => boolean): Item[] =>
  matrix.flatMap((row) => row.filter((node): node is Item => node !== null && p(node)))

/**
 * iterate thorough matrix to fold values obtained by callback
 */
export const foldMatrix = <V, Item>(
  matrix: Matrix<Item>,
  cb: (prev: V, item: Item | null) => V,
  init: V
): V => matrix.flatMap((row) => row).reduce(cb, init)
