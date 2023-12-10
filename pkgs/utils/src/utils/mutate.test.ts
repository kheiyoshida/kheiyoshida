import { removeItemFromArray } from "./mutate";

test(`${removeItemFromArray.name}`, () => {
  const array = ['foo', 'bar', 'myao']
  removeItemFromArray(array, 'foo')
  expect(array).toMatchObject(['bar', 'myao'])
})