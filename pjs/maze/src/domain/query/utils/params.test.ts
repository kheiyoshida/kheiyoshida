import { makeDecreasingParameter, makeIncreasingParameter } from './params'

test.each<[params: Parameters<typeof makeDecreasingParameter>, cases: [status: number, result: number][]]>([
  [
    [0.5, 1, 80, 0],
    [
      [100, 1],
      [90, 1],
      [80, 1],
      [40, 0.75],
      [0, 0.5],
    ],
  ],
  [
    [0.5, 1, 1500, 500],
    [
      [2000, 1],
      [1500, 1],
      [1000, 0.75],
      [500, 0.5],
      [0, 0.5],
    ],
  ],

])(`${makeDecreasingParameter.name}`, (args, cases) => {
  const param = makeDecreasingParameter(...(args as Parameters<typeof makeDecreasingParameter>))
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
])(`${makeIncreasingParameter.name}`, (args, cases) => {
  const param = makeIncreasingParameter(...(args as Parameters<typeof makeIncreasingParameter>))
  for (const [v, e] of cases) {
    expect(param(v)).toBe(e)
  }
})
