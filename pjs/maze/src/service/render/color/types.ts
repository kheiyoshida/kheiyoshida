import { ColorEffectPattern, ColorIntention } from '../../../domain/color/types'
import { ColorPalette } from './palette'

export type ColorManipFn = (
  palette: ColorPalette,
  params: ColorIntention
) => ColorPalette

export type ColorManipFnMap = { [k in ColorEffectPattern]: ColorManipFn }
