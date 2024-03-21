import { calcMapSizings } from './map'

test(`${calcMapSizings.name}`, () => {
  expect(calcMapSizings(1000, 11, 2)).toMatchInlineSnapshot(`
    {
      "edgeSize": 125,
      "nodeSize": 62.5,
      "sizeAvg": 93.75,
    }
  `)
})
