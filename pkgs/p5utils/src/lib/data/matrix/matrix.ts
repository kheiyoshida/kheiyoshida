import { randomIntBetween } from "utils"
import { Matrix, MatrixDirection, MatrixDraw, MatrixLoc } from "./types"

export const iterateMatrix = <T>(matrix: T[][], draw: MatrixDraw<T>) => {
  matrix.forEach((row, y) => {
    row.forEach((rgba, x) => {
      draw(x, y, rgba)
    })
  })
}

export const createEmptyMatrix = <T>(
  sizeX: number,
  sizeY: number,
  initial: T | null = null
): Matrix<T> => {
  try {
    const emptyMatrix: Matrix<T> = Array(sizeY)
      .fill(null)
      .map((_) => Array(sizeX).fill(initial))
    return emptyMatrix
  } catch (e) {
    console.error(`something went wrong with the config: ${sizeX} ${sizeY} ${initial}`)
    throw e
  }
}

export class MatrixRangeError extends Error {
  constructor(loc: number, length: number, val?: any) {
    super(
      `Matrix out of range: ${loc} against matrix length ${length}. value = ${val}`
    )
  }
}

export const lookupMatrix = <T>(matrix: Matrix<T>, [x, y]: MatrixLoc): T => {
  if (matrix[y] === undefined) {
    throw new MatrixRangeError(y, matrix.length)
  } else {
    const val = matrix[y][x]
    if (val === undefined) {
      throw new MatrixRangeError(x, matrix[0].length)
    }
    return val
  }
}

/**
 * swap side effect
 */
export const swapMatrix = <T>(
  matrix: Matrix<T>,
  [x, y]: MatrixLoc,
  value: T
) => {
  lookupMatrix(matrix, [x, y])
  matrix[y][x] = value
}

/**
 * get random position from matrix that's not filled yet
 */
export const randomMatrixLoc = <T>(matrix: Matrix<T>, retry = 0): MatrixLoc => {
  const y = randomIntBetween(0, matrix.length)
  const row = matrix[y]
  const validIndexes = row
    .map((v, i) => [v, i])
    .filter(([v, i]) => v !== null) as [T, number][]
  if (!validIndexes.length) {
    if (retry < 200) return randomMatrixLoc(matrix, retry + 1)
    else throw Error(`max retry exceeded`)
  }
  const [_, x] = validIndexes[randomIntBetween(0, validIndexes.length)]
  return [x, y]
}

export const sumLocation = (
  original: MatrixLoc,
  plus: MatrixLoc
): MatrixLoc => {
  return [original[0] + plus[0], original[1] + plus[1]]
}

export const directionLoc = (
  [x, y]: MatrixLoc,
  direction: MatrixDirection
): MatrixLoc => {
  switch (direction) {
    case 't':
      return [x, y - 1]
    case 'r':
      return [x + 1, y]
    case 'b':
      return [x, y + 1]
    case 'l':
      return [x - 1, y]
    case 'tr':
      return [x + 1, y - 1]
    case 'tl':
      return [x - 1, y - 1]
    case 'br':
      return [x + 1, y + 1]
    case 'bl':
      return [x - 1, y + 1]
  }
}
