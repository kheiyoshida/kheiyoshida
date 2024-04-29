import p5 from 'p5'
import { moveColor, randomColor, randomColorVector } from 'p5utils/src/render'
import { ColorOperationPattern } from '../../../domain/translate/color/types'
import { Colors } from './colors'
import { RGB } from '.'

export type ColorOperation = (color: p5.Color, params: number[]) => p5.Color

export type ColorOperationMap = Record<ColorOperationPattern, ColorOperation>

export const createOperationMap = (defaultColorRGB: RGB): ColorOperationMap => ({
  default: () => p.color(...defaultColorRGB),
  stay: (c) => c,
  gradation: (c, [min, max]) => moveColor(c, randomColorVector([min, max])),
  return: (c, [lerpVal]) => p.lerpColor(c, p.color(...defaultColorRGB), lerpVal),
  random: randomColor,
  fadeout: (c, [steps]) => fadeOut(steps, c, p.color(...Colors.darkness))(),
})

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
