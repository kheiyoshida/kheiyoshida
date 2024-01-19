import { createEmptyMatrix, lookupMatrix, swapMatrix } from './matrix'
import { Matrix } from './types'

test(`swapMatrix`, () => {
  const matrix: Matrix<boolean> = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]
  swapMatrix(matrix, [0, 0], true)
  expect(lookupMatrix(matrix, [0, 0])).toBe(true)
})

test(`createEmptyMatrix`, () => {
  expect(createEmptyMatrix(3, 4)).toMatchObject([
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])
})

test(`lookupMatrix`, () => {
  const matrix: Matrix<boolean> = [
    [false, false, false],
    [true, false, false],
    [false, false, false],
  ]
  expect(lookupMatrix(matrix, [0,1])).toBe(true)
})
