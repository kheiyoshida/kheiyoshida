import { clamp, randomIntInclusiveBetween } from 'utils'
import { Color, RGB } from '.'
import { ColorOperationPattern } from '../../../domain/translate/color/types'
import { Colors } from './colors'
import { blue, green, red } from './colorUtil.ts'

export type ColorOperation = (color: Color, params: number[]) => Color

export type ColorOperationMap = Record<ColorOperationPattern, ColorOperation>

export const createOperationMap = (defaultColorRGB: RGB): ColorOperationMap => ({
  default: () => defaultColorRGB,
  stay: (c) => c,
  gradation: (c, [min, max]) => slideColor(c, min, max),
  return: (c, [lerpVal]) => lerpColor(c, defaultColorRGB, lerpVal),
  random: randomColor,
  fadeout: (c, [steps]) => fadeOut(steps, c, Colors.darkness)(),
})

const slideColor = (c: Color, min: number, max: number) => {
  const delta = randomIntInclusiveBetween(min, max)
  return moveColor(c, [delta, delta, delta])
}

/**
 * ported from p5utils
 */
const moveColor = (original: Color, colorVector: RGB): Color => {
  const [c1, c2, c3] = colorVector.map((v) => randomIntInclusiveBetween(0, v))
  return [red(original) + c1, green(original) + c2, blue(original) + c3]
}

/**
 * ported from p5utils
 */
const randomColor = (original?: Color): Color => {
  const [c1, c2, c3] = Array(3)
    .fill(0)
    .map((_) => randomIntInclusiveBetween(0, 255))
  return original ? [c1, c2, c3] : [c1, c2, c3]
}

export const fadeOut = (steps: number, startColor: Color, destColor: Color = Colors.gray) => {
  const halfSteps = Math.floor(steps / 3)
  const fadingPalettes = [...Array(halfSteps)].map((_, i) =>
    lerpColor(startColor, destColor, (i + 1) / halfSteps)
  )
  const fadeoutPalettes = fadingPalettes.concat([...Array(steps - halfSteps)].fill(destColor))
  return () => {
    const dest = fadeoutPalettes.shift()
    if (!dest) {
      throw Error(`ran out of fade out palette`)
    }
    return dest
  }
}

/**
 * port of p5.Color.lerpColor
 *
 * Blends two colors to find a third color between them.
 * The amt parameter specifies the amount to interpolate between the two values.
 * 0 is equal to the first color, 0.1 is very near the first color, 0.5 is halfway between the two colors, and so on.
 * Negative numbers are set to 0. Numbers greater than 1 are set to 1.
 * This differs from the behavior of lerp.
 * It's necessary because numbers outside the interval [0, 1] will produce strange and unexpected colors.
 * The way that colors are interpolated depends on the current colorMode().
 * Params:
 *
 * c1 – interpolate from this color.
 * c2 – interpolate to this color.
 * amt – number between 0 and 1.
 * Returns:
 * interpolated color.
 */
export const lerpColor = (c1: RGB, c2: RGB, amt: number) => {
  amt = clamp(amt, 0, 1)

  const newColor: RGB = [0, 0, 0]
  const mix = (a: number, b: number, amt: number) => a * amt + b * (1 - amt)
  for (let i = 0; i < 3; i++) {
    newColor[i] = mix(c1[i], c2[i], amt)
  }
  return newColor
}
