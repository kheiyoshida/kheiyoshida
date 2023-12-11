import {
  fireByRate,
  randomFloatBetween,
  randomIntBetween,
  randomIntInclusiveBetween,
} from './value'

describe(`${fireByRate.name}`, () => {
  it(`should get boolean value based on provided rate`, () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.5)
    expect(fireByRate(0.5)).toBe(true)
    expect(fireByRate(0.5)).toBe(false)
    expect(fireByRate(0.5)).toBe(true)
  })
  it(`should reject rate greater than 1`, () => {
    expect(() => fireByRate(1.01)).toThrow()
  })
  it(`should reject negative rate`, () => {
    expect(() => fireByRate(-0.1)).toThrow()
  })
})

describe(`${randomFloatBetween.name}`, () => {
  it(`should get random float value between provided values`, () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.33)
    expect(randomFloatBetween(0, 10).toFixed(1)).toBe('3.3')
  })
})

describe(`${randomIntBetween.name}`, () => {
  it(`should get random int value between provided values`, () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.33)
      .mockReturnValueOnce(0.88)
      .mockReturnValueOnce(0.999)
    expect(randomIntBetween(0, 10)).toBe(3)
    expect(randomIntBetween(0, 10)).toBe(8)
    expect(randomIntBetween(0, 10)).toBe(9)
  })
})

describe(`${randomIntInclusiveBetween.name}`, () => {
  it(`should get random int value inclusively between provided values`, () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.77)
      .mockReturnValueOnce(0.999)
    expect(randomIntInclusiveBetween(0, 4)).toBe(1)
    expect(randomIntInclusiveBetween(0, 4)).toBe(3)
    expect(randomIntInclusiveBetween(0, 4)).toBe(4)
  })
})
