import { expect } from '..'

describe('toMatchCloseObject', () => {
  it('should match when objects have close values', () => {
    expect({
      k: 0.02,
    }).toMatchCloseObject({
      k: 0.015,
    })
    expect({
      k: 0.02,
    }).not.toMatchCloseObject({
      k: -0.01,
    })
  })
  it(`can adjust the diff range`, () => {
    expect({
      k: 0.1,
    }).toMatchCloseObject(
      {
        k: 1,
      },
      1.0
    )
  })
  it(`shouldn't match when key's missing`, () => {
    expect({
      a: 1,
      b: 2,
    }).toMatchCloseObject({
      a: 0.99,
      b: 2.01,
    })
    expect({
      a: 1,
      b: 2,
    }).not.toMatchCloseObject({
      a: 0.99,
      b: 2.01,
      c: 0.3,
    })
  })
  it(`can be also used with arrays`, () => {
    expect([1, 2, 3]).toMatchCloseObject([1.01, 2.001, 3.002])
    expect([1, 2, 3]).not.toMatchCloseObject([1.01, 2.001, 3.002, 4.002])
  })
})
