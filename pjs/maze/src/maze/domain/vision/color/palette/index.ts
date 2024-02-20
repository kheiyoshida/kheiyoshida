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

/**
 * get current palette. use this to apply, change, or mutate
 */
export const getPalette = (): ColorPalette => Palette || defaultPalette()

/**
 * replace palette object
 */
export const setPalette = (palette: ColorPalette): void => {
  Palette = palette
}

/**
 * get color in current palette
 * @deprecated use single life cycle for color changes for consistency
 */
export const getPaletteColor = (domain: ColorDomains): p5.Color =>
  getPalette()[domain]

/**
 * change palette's color and returns new palette object
 */
export const changePaletteColor = (domain: ColorDomains, color: p5.Color) => ({
  ...Palette,
  [domain]: color,
})

/**
 * apply palette colors to p5 instance
 */
export const applyPalette = (palette: ColorPalette) => {
  applyColor('fill', palette.fill)
  applyColor('stroke', palette.stroke)
  applyColor('background', palette.fill)
}
