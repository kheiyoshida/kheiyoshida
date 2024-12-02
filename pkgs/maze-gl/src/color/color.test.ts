import { Color } from './color'

describe(`Color`, () => {
  it(`can construct a color from hsl values`, () => {
    const color = new Color(120, 1, 0.5)
    expect(color.#values).toEqual([120, 1, 0.5])
    expect(color.rgbValues).toEqual([0, 255, 0])
    expect(color.normalizedRGB).toEqual([0, 1, 0])
    expect(color.hue).toBe(120)
    expect(color.saturation).toBe(1)
    expect(color.lightness).toBe(0.5)
  })

  it(`can construct a color from rgb values`, () => {
    const color = Color.fromRGB(0, 255, 0)
    expect(color.rgbValues).toEqual([0, 255, 0])
    expect(color.#values).toEqual([120, 1, 0.5, 1])
  })

  it(`can rotate hue`, () => {
    const color = new Color(240, 1, 0.5)
    color.rotateHue(240)
    expect(color.hue).toBe(120)
  })
})
