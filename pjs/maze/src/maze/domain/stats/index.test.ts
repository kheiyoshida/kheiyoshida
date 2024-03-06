import { nextStat } from '.'

describe(`status manipulation`, () => {
  it(`should limit the range of status value`, () => {
    // plus
    expect(nextStat(98, 1, 100, 0)).toBe(99)
    expect(nextStat(99, 1, 100, 0)).toBe(100)
    expect(nextStat(100, 1, 100, 0)).toBe(100)
    expect(nextStat(101, 1, 100, 0)).toBe(100)
    expect(nextStat(0, 1, 100, 0)).toBe(1)

    // minus
    expect(nextStat(101, -1, 100, 0)).toBe(100)
    expect(nextStat(100, -1, 100, 0)).toBe(99)
    expect(nextStat(2, -1, 100, 0)).toBe(1)
    expect(nextStat(1, -1, 100, 0)).toBe(0)
    expect(nextStat(0, -1, 100, 0)).toBe(0)
  })
})
