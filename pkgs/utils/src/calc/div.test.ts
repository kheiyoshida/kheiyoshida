import {
  clamp,
  clampAnd,
  createOneStartArray,
  getCommonDivisors,
  getCommonFloatDivisors,
  getDivisors,
  getFloatDivisors,
  validateInt,
} from './div'

describe(`${validateInt.name}`, () => {
  expect(() => validateInt(0.5)).toThrow()
  expect(() => validateInt(2)).not.toThrow()
})

describe(`${createOneStartArray.name}`, () => {
  it(`should get int array that starts with 1`, () => {
    expect(createOneStartArray(10)).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

describe(`${getDivisors.name}`, () => {
  it(`should get divisors of int`, () => {
    expect(getDivisors(10)).toMatchObject([1, 2, 5, 10])
  })
})

describe(`${getFloatDivisors.name}`, () => {
  it(`should get float divisors with specified precisions`, () => {
    expect(getFloatDivisors(10, 1)).toMatchObject([1, 2, 2.5, 5, 10])
    expect(getFloatDivisors(10, 2)).toMatchObject([1, 1.25, 2, 2.5, 5, 10])
  })
  it(`should limit the number of results`, () => {
    expect(getFloatDivisors(100, 2, 10)).toHaveLength(10)
  })
})

describe(`${getCommonDivisors.name}`, () => {
  it(`should get common divisors`, () => {
    expect(getCommonDivisors(10, 5)).toMatchObject([1, 5])
  })
})

describe(`${getCommonFloatDivisors.name}`, () => {
  it(`should get common float divisors`, () => {
    expect(getCommonFloatDivisors(10, 5, 2, 10)).toMatchObject([1, 1.25, 2.5, 5])
  })
})

describe(`${clamp.name}`, () => {
  it(`should clamp value to the range`, () => {
    expect(clamp(10, 1, 5)).toBe(5)
  })
})

describe(`${clampAnd.name}`, () => {
  it(`should clamp and exec callback when clamped`, () => {
    const fn = jest.fn()
    clampAnd(10, 1,5)(fn)
    expect(fn).toHaveBeenCalled()
    const fn2 = jest.fn()
    clampAnd(3, 1,5)(fn2)
    expect(fn2).not.toHaveBeenCalled()
  })
})