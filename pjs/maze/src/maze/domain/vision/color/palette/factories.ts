import {
  ColorVector,
  moveColor,
  randomColor,
  randomColorVector,
  transColor,
} from 'src/lib/p5utils/color'
import { ColorPalette } from '.'
import { Colors } from '../constants'

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
