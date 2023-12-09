import { lookupMatrix } from './matrix'
import {
  checkAdjacent,
  createRegion,
  getRegion,
  growRegion,
  randomSeed,
} from './region'

test(`checkAdjacent`, () => {
  const matrix: RegionMatrix = [
    [false, false, false],
    [false, false, false],
    [false, true, false],
  ]
  expect(lookupMatrix(matrix, [1, 2])).toBe(true)
  expect(checkAdjacent(matrix, [0, 2])).toMatchObject(['t'])
})

test(`growRegion`, () => {
  const matrix = createRegion(5, 5)
  expect(getRegion(matrix)).toHaveLength(0)
  randomSeed(matrix)
  expect(getRegion(matrix)).toHaveLength(1)
  growRegion(matrix)
  expect(getRegion(matrix)).toHaveLength(2)
})
