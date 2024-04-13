import p5 from 'p5'
import { applyColor } from 'p5utils/src/render'
import { defaultPalette } from './factories'

export type ColorDomains = 'fill' | 'stroke'

export type ColorPalette = Readonly<{
  [k in ColorDomains]: p5.Color
}>

/**
 * replacable var that contains colors
 * @todo consider making it state
 */
let Palette: ColorPalette

export const getPalette = (): ColorPalette => Palette || defaultPalette()

export const setPalette = (palette: ColorPalette): void => {
  Palette = palette
}
export const getPaletteColor = (domain: ColorDomains): p5.Color =>
  getPalette()[domain]

export const changePaletteColor = (domain: ColorDomains, color: p5.Color) => ({
  ...Palette,
  [domain]: color,
})

export const applyPalette = (palette: ColorPalette) => {
  applyColor('fill', palette.fill)
  applyColor('stroke', palette.stroke)
  applyColor('background', palette.fill)
}
