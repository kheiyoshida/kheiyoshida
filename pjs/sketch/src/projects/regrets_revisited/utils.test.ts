import { makeCycle } from './utils'

test.each([
  [14, 4],
  [-3, 7],
  [10, 0]
])(`${makeCycle.name} %i -> %i`, (value, expected) => {
  const cycle10 = makeCycle(10)
  expect(cycle10(value)).toBe(expected)
})
