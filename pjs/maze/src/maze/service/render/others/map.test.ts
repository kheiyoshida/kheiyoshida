import { calcMapSizings } from './map'

test(`${calcMapSizings.name}`, () => {
  expect(calcMapSizings(1000, 11)).toMatchInlineSnapshot(`
    {
      "edgeSize": 109.0909090909091,
      "nodeSize": 75.75757575757576,
      "sizeAvg": 92.42424242424244,
    }
  `)
})
