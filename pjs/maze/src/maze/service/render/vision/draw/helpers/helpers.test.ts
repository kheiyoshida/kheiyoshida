import { distribute } from './helpers'

describe(`distribute`, () => {
  it(`should distribute the percent of region as multiple random range wihtout overwrapping`, () => {
    const result = distribute(50)
    expect(result.every(([m1, m2]) => m2 > m1)).toBe(true)
    result.forEach(([_, m2], i, a) => {
      if (i !== a.length - 1) {
        expect(m2).toBeLessThan(a[i + 1][0])
      }
    })
    expect(result.reduce((p, [m1, m2]) => p + (m2 - m1), 0)).toBe(50)
  })
  it(`should give each range 1% at least`, () => {
    const result = distribute(1)
    expect(result.length).toBe(1)
    expect(result[0][1] - result[0][0]).toBe(1)
  })
  it(`should not distribute if the received percentage is not above 1 %`, () => {
    const result = distribute(0)
    expect(result.length).toBe(0)
  })
})
