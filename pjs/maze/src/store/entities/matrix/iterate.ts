import { Position } from '../../../lib/utils/position'
import { Matrix } from './matrix'
import { Node } from './node'

/**
 * iterate over the matrix's cells
 * 'break'able when done
 * @param cb return true when done
 */
export const iteratePosition = (
  matrix: Matrix,
  cb: (matrix: Matrix, position: Position) => boolean
) => {
  matrix.every((row, i) => row.every((_, j) => !cb(matrix, [i, j])))
}

/**
 * iterate each node in matrix.
 * @param cb return true when done
 */
export const iterateEachNode = (matrix: Matrix, cb: (matrix: Matrix, node: Node) => void) => {
  matrix.forEach((row) =>
    row.forEach((item) => {
      if (item) cb(matrix, item)
    })
  )
}

/**
 * iterate each node in matrix. cancellable
 * @param cb return true when done
 */
export const cancellableIterateEachNode = (
  matrix: Matrix,
  cb: (matrix: Matrix, node: Node) => boolean
) =>
  iteratePosition(matrix, (matrix, [row, col]) => {
    const node = matrix[row][col]
    if (node) return cb(matrix, node)
    else return false
  })

/**
 * iterate through matrix items and collect data array
 */
export const mapMatrix = <T>(matrix: Matrix, cb: (item: Node | null) => T): T[] =>
  matrix.flatMap((row) => row.map(cb))

/**
 * iterate through matrix nodes and collect data array
 */
export const mapNodes = <T>(matrix: Matrix, cb: (node: Node) => T): T[] =>
  matrix.flatMap((row) => row.filter((item): item is Node => item !== null).map(cb))

/**
 * filter nodes in matrix and map
 */
export const filterNodes = (matrix: Matrix, p: (node: Node) => boolean): Node[] =>
  matrix.flatMap((row) => row.filter((node): node is Node => node !== null && p(node)))

/**
 * iterate thorough matrix and fold values
 */
export const reduceMatrix = <T>(
  matrix: Matrix,
  cb: (prev: T, item: Node | null) => T,
  init: T
): T => matrix.flatMap((row) => row).reduce(cb, init)
