import { clamp, clampAnd, NumRange, restrainWithinRange } from './range'

describe(`${clamp.name}`, () => {
  it(`should clamp value to the range`, () => {
    expect(clamp(10, 1, 5)).toBe(5)
  })
})

describe(`${clampAnd.name}`, () => {
  it(`should clamp and exec callback when clamped`, () => {
    const fn = jest.fn()
    clampAnd(10, 1, 5)(fn)
    expect(fn).toHaveBeenCalled()
    const fn2 = jest.fn()
    clampAnd(3, 1, 5)(fn2)
    expect(fn2).not.toHaveBeenCalled()
  })
})

describe('NumRange', () => {
  it('includes', () => {
    const range = new NumRange({ min: 40, max: 60 })
    expect(range.includes(50)).toBe(true)
    expect(range.includes(40)).toBe(true)
    expect(range.includes(60)).toBe(true)
    expect(range.includes(39)).toBe(false)
    expect(range.includes(61)).toBe(false)
  })
  it('within', () => {
    const range = new NumRange({ min: 40, max: 60 })
    expect(range.within({ min: 30, max: 80 })).toBe(true)
    expect(range.within({ min: 40, max: 60 })).toBe(true)
    expect(range.within({ min: 41, max: 60 })).toBe(false)
    expect(range.within({ min: 40, max: 59 })).toBe(false)
  })
  it('can take numrange in constructor', () => {
    const r = new NumRange({ min: 40, max: 60 })
    const r2 = new NumRange(r)
    expect(r2).toBe(r)
  })
})

describe(`${restrainWithinRange.name}`, () => {
  it(`should restrain range within another`, () => {
    const result = restrainWithinRange(
      { min: 10, max: 20},
      { min: 5, max: 15},
    )
    expect(result).toMatchObject({ min: 10, max: 15})
  })
})