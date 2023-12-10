import { getSubset, valueOrFn } from './get'

test(`${getSubset.name}`, () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  expect(getSubset(obj, ['a', 'c'])).toMatchObject({
    a: 1,
    c: 3,
  })
})

test(`${valueOrFn.name}`, () => {
  const circle = {
    r: 3
  }
  expect(valueOrFn(circle, (c) => c.r )).toBe(3)
  expect(valueOrFn(circle, 3.14 )).toBe(3.14)
})
