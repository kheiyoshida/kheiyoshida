import { randomRemove } from "./utils"
import * as calc from './calc'

it(`randomRemove`, () => {
  jest.spyOn(calc, 'random')
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)
  const [survived, removed] = randomRemove([1,2,3])
  expect(removed).toMatchObject([1,3])
  expect(survived).toMatchObject([2])
})
