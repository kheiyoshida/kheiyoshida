import { NumRange } from "./primitives";
describe('NumRange', () => {
  it('includes', () => {
    const range = new NumRange({min: 40, max: 60})
    expect(range.includes(50)).toBe(true)
    expect(range.includes(40)).toBe(true)
    expect(range.includes(60)).toBe(true)
    expect(range.includes(39)).toBe(false)
    expect(range.includes(61)).toBe(false)
  })
  it('within', () => {
    const range = new NumRange({min: 40, max: 60})
    expect(
      range.within({min: 30, max: 80})
    ).toBe(true)
    expect(
      range.within({min: 40, max: 60})
    ).toBe(true)
    expect(
      range.within({min: 41, max: 60})
    ).toBe(false)
    expect(
      range.within({min: 40, max: 59})
    ).toBe(false)
  })
  it('can take numrange in constructor', () => {
    const r = new NumRange({min: 40, max: 60})
    const r2 = new NumRange(r)
    expect(r2).toBe(r)
  })
})