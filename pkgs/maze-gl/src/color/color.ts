import chroma from 'chroma-js'
import { HSL, RGB } from './types'
import { clamp } from 'utils'

export class Color {
  readonly values: HSL

  constructor(...hsl: HSL) {
    this.values = hsl
  }

  /**
   * construct a color from 0-255 rgb values
   */
  static fromRGB(...rgb: RGB): Color {
    return new Color(...chroma.rgb(...rgb).hsl())
  }

  get rgbValues(): RGB {
    return chroma.hsl(...this.values).rgb()
  }

  /**
   * get rgb values in 0-1 range so shaders can understand
   */
  get normalizedRGB(): RGB {
    return this.rgbValues.map((v) => v / 255) as RGB
  }

  clone(): Color {
    return new Color(...this.values)
  }

  get hue(): number {
    return this.values[0]
  }

  set hue(value: number) {
    this.values[0] = value
  }


  get saturation(): number {
    return this.values[1]
  }

  static MinSaturation = 0.0
  static MaxSaturation = 1.0
  set saturation(value: number) {
    this.values[1] = clamp(value, Color.MinSaturation, Color.MaxSaturation);
  }

  get lightness(): number {
    return this.values[2]
  }

  static MinLightness = 0.01
  static MaxLightness = 1.0
  set lightness(value: number) {
    this.values[2] = clamp(value, Color.MinLightness, Color.MaxLightness);
  }

  /**
   * @deprecated use setter
   */
  fixLightness(value: number): Color {
    this.lightness = value
    return this
  }

  rotateHue(diff: number): void {
    this.hue = (this.hue + diff) % 360
  }
}
