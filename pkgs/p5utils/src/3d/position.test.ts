import {
  distanceBetweenPositions,
  divPosition3d,
  multPosition3d,
  sumPosition3d,
  vectorBetweenPositions,
} from './position'

test(`${distanceBetweenPositions.name}`, () => {
  expect(distanceBetweenPositions([100, 100, 100], [100, 0, 100])).toBe(100)
})

test(`${vectorBetweenPositions.name}`, () => {
  const result = vectorBetweenPositions([100, 100, 0], [0, 100, 0])
  expect(result.array()).toMatchObject([-100, 0, 0])
})

test(`${sumPosition3d.name}`, () => {
  expect(sumPosition3d([0, 10, 10], [20, 30, 0], [0, 10, 10])).toMatchObject([20, 50, 20])
})

test(`${divPosition3d.name}`, () => {
  expect(divPosition3d([100, 30, 50], 10)).toMatchObject([10, 3, 5])
})

test(`${multPosition3d.name}`, () => {
  expect(multPosition3d([100, 30, 50], 10)).toMatchObject([1000, 300, 500])
})
