import { Position, validatePosition } from './position.ts'
import { adjacentInDirection, Direction } from './direction.ts'

/**
 * data structure for square matrix.
 * - each item can be null
 */
export type Matrix<Item = unknown> = Array<Array<Item | null>>

export const countMatrixNodes = (matrix: Matrix): number =>
  foldMatrix(matrix, (p, item) => p + (item !== null ? 1 : 0), 0)

/**
 * get adjacent position in provided direction.
 * it can be null if the adjacent position is out of matrix
 */
export const adjacentPositionInMatrix = (d: Direction, p: Position, matrixSize: number): Position | null =>
  validatePosition(adjacentInDirection(d, p), {
    min: 0,
    max: matrixSize - 1,
  })

/**
 * safely get an item from a matrix in a given position.
 * returns null when the position is out of range.
 */
export const getMatrixItem = <Item>(matrix: Matrix<Item>, position: Position): Item | null => {
  const validPos = validatePosition(position, { min: 0, max: matrix.length })
  if (!validPos) return null
  return matrix[validPos[0]][validPos[1]]
}

/**
 * get the adjacent item.
 * note that returned value can be null
 */
export const getAdjacentItem = <Item>(matrix: Matrix<Item>, nodePos: Position, d: Direction): Item | null => {
  const pos = adjacentPositionInMatrix(d, nodePos, matrix.length)
  return pos ? getMatrixItem(matrix, pos) : null
}

/**
 * get position's block, assuming item is there
 * @throws Error when block is actually null
 */
export const getConcreteMatrixItem = <Item>(matrix: Matrix<Item>, position: Position): Item => {
  const item = getMatrixItem(matrix, position)
  if (item === null) throw Error(`null returned, not an item (at ${position.toString()})`)
  return item
}

/**
 * iterate over each position in the matrix
 * @param matrix
 * @param cb return true when done
 */
export const iterateByPosition = <Item>(matrix: Matrix<Item>, cb: (matrix: Matrix<Item>, position: Position) => boolean) => {
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

