import { distanceBetweenPositions, sumPosition3d, vectorBetweenPositions } from './position'

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
