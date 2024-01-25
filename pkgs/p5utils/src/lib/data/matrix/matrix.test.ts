import {
  createEmptyMatrix,
  iterateMatrix,
  lookupMatrix,
  getRandomMatrixPositionWithCondition,
  swapMatrix,
  sumLocation,
  directionLoc,
} from './matrix'
import { Matrix } from './types'

test(`${iterateMatrix.name}`, () => {
  const matrix: Matrix<number> = [
    [1, 2, 3],
    [4, 5, 6],
  ]
  const cb = jest.fn()
  iterateMatrix(matrix, cb)
  expect(cb).toHaveBeenCalledWith(0, 0, 1)
  expect(cb).toHaveBeenCalledWith(1, 0, 2)
  expect(cb).toHaveBeenCalledWith(2, 0, 3)
  expect(cb).toHaveBeenCalledWith(0, 1, 4)
  expect(cb).toHaveBeenCalledWith(1, 1, 5)
  expect(cb).toHaveBeenCalledWith(2, 1, 6)
})

test(`${createEmptyMatrix.name}`, () => {
  expect(createEmptyMatrix(3, 2, null)).toMatchObject([
    [null, null, null],
    [null, null, null],
  ])
  expect(createEmptyMatrix(3, 4)).toMatchObject([
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])
})

test(`${lookupMatrix.name}`, () => {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
  ]
  expect(lookupMatrix(matrix, [1, 1])).toBe(5)
})

test(`${swapMatrix.name}`, () => {
  const matrix: Matrix<boolean> = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]
  swapMatrix(matrix, [0, 0], true)
  expect(lookupMatrix(matrix, [0, 0])).toBe(true)
})

test(`${getRandomMatrixPositionWithCondition.name}`, () => {
  const matrix = [
    [null, null, 2],
    [3, null, 2],
  ]
  const filled = [
    [2, 0],
    [0, 1],
    [2, 1],
  ]
  const includes = (result: number[]) =>
    filled.some((a) => a[0] === result[0] && a[1] === result[1])
  ;[...new Array(10)].map(() => {
    const result = getRandomMatrixPositionWithCondition(matrix, (v) => v !== null)
    expect(includes(result)).toBe(true)
  })
})

test(`${sumLocation.name}`, () => {
  expect(sumLocation([2, 1], [1, 1])).toMatchObject([3, 2])
})

test(`${directionLoc.name}`, () => {
  expect(directionLoc([1, 1], 'tl')).toMatchObject([0, 0])
})
