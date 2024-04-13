import { createDecreasingParameter, createIncreasingParameter } from './params'

test.each([
  [
    [0.5, 1, 80],
    [
      [100, 1],
      [90, 1],
      [80, 1],
      [40, 0.75],
      [0, 0.5],
    ],
  ],
  
])(`${createDecreasingParameter.name}`, (args, cases) => {
  const param = createDecreasingParameter(...(args as Parameters<typeof createDecreasingParameter>))
  for (const [v, e] of cases) {
    expect(param(v)).toBe(e)
  }
})

test.each([
  [
    [1, 3, 100],
    [
      [200, 1],
      [150, 1],
      [100, 1],
      [50, 2],
      [0, 3],
    ],
  ],
])(`${createIncreasingParameter.name}`, (args, cases) => {
  const param = createIncreasingParameter(...(args as Parameters<typeof createIncreasingParameter>))
  for (const [v, e] of cases) {
    expect(param(v)).toBe(e)
  }
})
