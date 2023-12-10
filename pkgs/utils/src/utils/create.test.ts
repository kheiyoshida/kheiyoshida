import {
  concatWithJunction,
  createCombination,
  deepCopy,
  overrideDefault,
  splicedArray,
} from './create'

test(`${deepCopy.name}`, () => {
  const original = { name: 'john', age: 20 }
  const result = deepCopy(original)
  expect(original === result).not.toBe(true)
})

test(`${overrideDefault.name}`, () => {
  const defaultObj: { name: string; age: number; address?: string } = {
    name: 'john',
    age: 20,
    address: 'somewhere',
  }
  const result = overrideDefault(defaultObj, { name: 'myao', address: undefined })
  expect(result).toMatchObject({
    name: 'myao',
    age: 20,
    address: 'somewhere',
  })
})

test(`${concatWithJunction.name}`, () => {
  const a = ['c', 'o', 'n', 'c']
  const b = ['c', 'a', 't']
  expect(concatWithJunction(a, b)).toMatchObject(['c', 'o', 'n', 'c', 'a', 't'])
})

test(`${createCombination.name}`, () => {
  expect(createCombination(['a', 'b', 'c'])).toMatchObject([
    ['a', 'b'],
    ['a', 'c'],
    ['b', 'c'],
  ])
})

test(`${splicedArray.name}`, () => {
  expect(splicedArray([1, 2, 3], 1, 1)).toMatchObject([1, 3])
})
