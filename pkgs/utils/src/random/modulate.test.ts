import { createShuffledArray, makeIntWobbler } from './modulate'

describe(`${makeIntWobbler.name}`, () => {
  it(`should change value by ranged random value`, () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.02)
      .mockReturnValueOnce(0.98)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.8)
    const wobbler = makeIntWobbler(10)
    expect(wobbler(0)).toBe(-10)
    expect(wobbler(0)).toBe(10)
    expect(wobbler(0)).toBe(0)
    expect(wobbler(0)).toBe(6)
  })
})

describe(`${createShuffledArray.name}`, () => {
  it(`should create a new shuffled array`, () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(createShuffledArray(['a', 'b', 'c', 'd', 'e'])).toMatchObject(['e', 'd', 'c', 'b', 'a'])
  })
})
