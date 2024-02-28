/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomIntInclusiveBetween } from 'utils'
import { Matrix, MatrixDirection, MatrixDraw, MatrixLoc } from './types'

export const iterateMatrix = <T>(matrix: T[][], cb: MatrixDraw<T>) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      cb(x, y, value)
    })
  })
}

export const createEmptyMatrix = <T>(
  sizeX: number,
  sizeY: number,
  initial: T | null = null
): Matrix<T> => {
  const emptyMatrix: Matrix<T> = Array(sizeY)
    .fill(null)
    .map((_) => Array(sizeX).fill(initial))
  return emptyMatrix
}

export const lookupMatrix = <T>(matrix: Matrix<T>, [x, y]: MatrixLoc): T => {
  if (matrix[y] === undefined) throw new MatrixRangeError(y, matrix.length)
  const val = matrix[y][x]
  if (val === undefined) {
    throw new MatrixRangeError(x, matrix[0].length)
  }
  return val
}

export class MatrixRangeError extends Error {
  constructor(loc: number, length: number, val?: unknown) {
    super(`Matrix out of range: ${loc} against matrix length ${length}. value = ${val}`)
  }
}

export const swapMatrix = <T>(matrix: Matrix<T>, [x, y]: MatrixLoc, value: T): void => {
  lookupMatrix(matrix, [x, y])
  matrix[y][x] = value
}

export const getRandomMatrixPositionWithCondition = <T>(
  matrix: Matrix<T>,
  condition: (val: T) => boolean,
  retry = 0
): MatrixLoc => {
  const y = randomIntInclusiveBetween(0, matrix.length - 1)
  const row = matrix[y]
  const validIndexes = row.map((v, i) => [v, i]).filter(([v, _]) => condition(v as T)) as [
    T,
    number,
  ][]
  if (!validIndexes.length) {
    if (retry < 200) return getRandomMatrixPositionWithCondition(matrix, condition, retry + 1)
    else throw Error(`max retry exceeded`)
  }
  const [_, x] = validIndexes[randomIntInclusiveBetween(0, validIndexes.length - 1)]
  return [x, y]
}

export const sumLocation = (original: MatrixLoc, plus: MatrixLoc): MatrixLoc => {
  return [original[0] + plus[0], original[1] + plus[1]]
}

export const DirectionLoc: { [d in MatrixDirection]: MatrixLoc } = {
  t: [0, -1],
  r: [1, 0],
  b: [0, 1],
  l: [-1, 0],
  tr: [1, -1],
  tl: [-1, -1],
  br: [1, 1],
  bl: [-1, 1],
} 

export const directionLoc = (loc: MatrixLoc, direction: MatrixDirection): MatrixLoc => {
  return sumLocation(loc, DirectionLoc[direction])
}
