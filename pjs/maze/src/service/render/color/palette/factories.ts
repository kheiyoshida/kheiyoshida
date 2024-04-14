import {
  ColorVector,
  moveColor,
  randomColor,
  randomColorVector,
  transColor,
} from 'p5utils/src/render'
import { ColorPalette } from '.'
import { Colors } from './colors'

export type PaletteFactory = (palette: ColorPalette) => ColorPalette

export const defaultPalette = (): ColorPalette => ({
  fill: p.color(...Colors.black),
  stroke: p.color(...Colors.white),
})

export const randomizePalette: PaletteFactory = (palette) => ({
  fill: randomColor(palette.fill),
  stroke: randomColor(palette.stroke),
})

export const movePalette =
  (vector: ColorVector = randomColorVector([0, 10])): PaletteFactory =>
  (palette) => ({
    stroke: moveColor(palette.stroke, vector),
    fill: moveColor(palette.fill, vector),
  })

export const flipPalette: PaletteFactory = (palette) => ({
  stroke: palette.fill,
  fill: palette.stroke,
})

export const transFill =
  (alpha: number, min: number): PaletteFactory =>
  (palette) => ({
    ...palette,
    fill: transColor(palette.fill, alpha, min),
  })

export const returnTo =
  (destPalette: ColorPalette, lerpVal = 0.1): PaletteFactory =>
  (palette) => ({
    stroke: p.lerpColor(palette.stroke, destPalette.stroke, lerpVal),
    fill: p.lerpColor(palette.fill, destPalette.fill, lerpVal),
  })

export const fadeOut = (
  steps: number,
  startPalette: ColorPalette,
  destPalette: ColorPalette = {
    fill: p.color(...Colors.black),
    stroke: p.color(...Colors.black),
  }
): PaletteFactory => {
  const halfSteps = Math.floor(steps / 3)
  const fadingPalettes = [...Array(halfSteps)].map((_, i) => ({
    stroke: p.lerpColor(startPalette.stroke, destPalette.stroke, (i + 1) / halfSteps),
    fill: p.lerpColor(startPalette.fill, destPalette.fill, (i + 1) / halfSteps),
  }))
  const fadeoutPalettes = fadingPalettes.concat([...Array(steps - halfSteps)].fill(destPalette))
  return () => {
    const dest = fadeoutPalettes.shift()
    if (!dest) {
      throw Error(`ran out of fade out palette`)
    }
    return dest
  }
}
