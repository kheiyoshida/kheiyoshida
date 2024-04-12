import { randomColorVector } from 'p5utils/src/render'
import { ColorOperationPattern } from '../../../domain/color/types'
import { ColorPalette, getPalette } from './palette'
import {
  defaultPalette,
  fadeOut,
  flipPalette,
  movePalette,
  randomizePalette,
  returnTo,
  transFill,
} from './palette/factories'

export type ColorOperation = (palette: ColorPalette, params: number[]) => ColorPalette

export const OperationMap: Record<ColorOperationPattern, ColorOperation> = {
  default: defaultPalette,
  stay: getPalette,
  gradation: (palette, [min, max]) => movePalette(randomColorVector([min, max]))(palette),
  return: (palette, [lerpVal]) => returnTo(defaultPalette(), lerpVal)(palette),
  reverse: flipPalette,
  random: randomizePalette,
  trans: (palette, [alpha, min]) => transFill(alpha, min)(palette),
  fadeout: (palette, [steps]) => fadeOut(steps, palette)(palette)
}
