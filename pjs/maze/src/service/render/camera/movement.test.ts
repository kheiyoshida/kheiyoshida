import { createSinArray } from './movement'

test(`${createSinArray.name}`, () => {
  expect(createSinArray(4, 0.15)).toMatchInlineSnapshot(`
    [
      0,
      0.11753739745783764,
      0.2334453638559054,
      0.34611705707749296,
    ]
  `)
})
