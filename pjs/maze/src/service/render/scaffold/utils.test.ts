import { Scaffold } from './types'
import { slideScaffoldLayers, turnScaffold } from './utils'

test(`${slideScaffoldLayers.name}`, () => {
  const layer0 = {
    upper: [1, 2, 3, 4],
    lower: [5, 6, 7, 8],
  }
  const layer1 = {
    upper: [9, 10, 11, 12],
    lower: [13, 14, 15, 16],
  }
  const scaffold: Scaffold<number> = [layer0, layer1]
  const result = slideScaffoldLayers(scaffold, 1, () => layer0)
  expect(result[0]).toMatchObject(layer1)
  expect(result[1]).toMatchObject(layer0)
})

test(`${turnScaffold.name}`, () => {
  const scaffold: Scaffold<string> = [
    {
      lower: ['l00', 'l01', 'l02', 'l03'],
      upper: ['u00', 'u01', 'u02', 'u03'],
    },
    {
      lower: ['l10', 'l11', 'l12', 'l13'],
      upper: ['u10', 'u11', 'u12', 'u13'],
    },
    {
      lower: ['l20', 'l21', 'l22', 'l23'],
      upper: ['u20', 'u21', 'u22', 'u23'],
    },
    {
      lower: ['l30', 'l31', 'l32', 'l33'],
      upper: ['u30', 'u31', 'u32', 'u33'],
    },
  ]
  const result = turnScaffold(scaffold, 'right', () => ({
    upper: Array(4).fill('new'),
    lower: Array(4).fill('new'),
  }))
  expect(result[0].lower[0]).toBe('l21')
  expect(result[0].lower[1]).toBe('l11')
  expect(result[0].lower[2]).toBe('l01')
  expect(result[1].lower[0]).toBe('l22')
  expect(result[1].lower[1]).toBe('l12')
  expect(result[1].lower[2]).toBe('l02')
  expect(result[2].lower[0]).toBe('l23')
  expect(result[2].lower[1]).toBe('l13')
  expect(result[2].lower[2]).toBe('l03')
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "lower": [
          "l21",
          "l11",
          "l01",
          "new",
        ],
        "upper": [
          "u21",
          "u11",
          "u01",
          "new",
        ],
      },
      {
        "lower": [
          "l22",
          "l12",
          "l02",
          "new",
        ],
        "upper": [
          "u22",
          "u12",
          "u02",
          "new",
        ],
      },
      {
        "lower": [
          "l23",
          "l13",
          "l03",
          "new",
        ],
        "upper": [
          "u23",
          "u13",
          "u03",
          "new",
        ],
      },
      {
        "lower": [
          "new",
          "new",
          "new",
          "new",
        ],
        "upper": [
          "new",
          "new",
          "new",
          "new",
        ],
      },
    ]
  `)
})
