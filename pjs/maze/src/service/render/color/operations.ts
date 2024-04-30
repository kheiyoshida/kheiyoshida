import p5 from 'p5'
import { moveColor, randomColor } from 'p5utils/src/render'
import { randomIntInclusiveBetween } from 'utils'
import { RGB } from '.'
import { ColorOperationPattern } from '../../../domain/translate/color/types'
import { Colors } from './colors'

export type ColorOperation = (color: p5.Color, params: number[]) => p5.Color

export type ColorOperationMap = Record<ColorOperationPattern, ColorOperation>

export const createOperationMap = (defaultColorRGB: RGB): ColorOperationMap => ({
  default: () => p.color(...defaultColorRGB),
  stay: (c) => c,
  gradation: (c, [min, max]) => slideColor(c, min, max),
  return: (c, [lerpVal]) => p.lerpColor(c, p.color(...defaultColorRGB), lerpVal),
  random: randomColor,
  fadeout: (c, [steps]) => fadeOut(steps, c, p.color(...Colors.darkness))(),
})

const slideColor = (c: p5.Color, min: number, max: number) => {
  const delta = randomIntInclusiveBetween(min, max)
  return moveColor(c, [delta, delta, delta])
}

export const fadeOut = (
  steps: number,
  startColor: p5.Color,
  destColor: p5.Color = p.color(...Colors.gray)
) => {
  const halfSteps = Math.floor(steps / 3)
  const fadingPalettes = [...Array(halfSteps)].map((_, i) =>
    p.lerpColor(startColor, destColor, (i + 1) / halfSteps)
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
