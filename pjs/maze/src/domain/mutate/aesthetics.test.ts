import { updateAesthetics } from './aesthetics.ts'
import { store } from '../../store'
import * as util from 'utils'

jest.mock('utils', () => ({
  ...jest.requireActual('utils'),
  randomIntInclusiveBetween: jest.fn()
}));

test(`${updateAesthetics.name}`, () => {
  const spyRandomInt = jest.spyOn(util, 'randomIntInclusiveBetween')

  // 2
  spyRandomInt.mockReturnValueOnce(-1)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(4) // delta = -1

  // 3
  spyRandomInt.mockReturnValueOnce(-1)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(4) // delta = -1 but confined to be within range

  // 4 - entering poles style
  spyRandomInt.mockReturnValueOnce(-1)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(3) // delta = -1, not confined

  // 5
  spyRandomInt.mockReturnValueOnce(-1)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(2)

  // 6
  spyRandomInt.mockReturnValueOnce(-1)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(1)

  // 7
  spyRandomInt.mockReturnValueOnce(3)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(3) // delta = +2, but confined within range

  // 8 - should exit poles since we've been in the same range for 2 cycles
  spyRandomInt.mockReturnValueOnce(-1)
  spyRandomInt.mockReturnValueOnce(-2)
  spyRandomInt.mockReturnValueOnce(0)
  spyRandomInt.mockReturnValueOnce(2)
  store.incrementFloor()
  updateAesthetics()
  expect(store.current.aesthetics).toBe(5) // should be forced to retry until it exits the range
})
