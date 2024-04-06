import { createAccumulatedDistanceArray, createSinArray } from './movement'

test(`${createSinArray.name}`, () => {
  const result = createSinArray(4, 0.5)
  expect(result).toHaveLength(4)
  result.forEach((v) => {
    expect(v).toBeLessThanOrEqual(1.0)
  })
  expect(result[3]).toBeCloseTo(1.0)
})

test(`${createAccumulatedDistanceArray.name}`, () => {
  const result = createAccumulatedDistanceArray(8)
  expect(result).toHaveLength(8)
  result.forEach((v, i) => {
    expect(v).toBeLessThanOrEqual(1.0)
    expect(v).toBeLessThanOrEqual(result[i + 1] || 1.0)
  })

})
