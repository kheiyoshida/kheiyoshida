import { makeColorScheme } from './scheme.ts'
import { getMaterial } from '../object/material'
import { FloorColorParams, FrameColorParams } from '../../../integration/query/vision/color/types.ts'

import { Atmosphere } from '../../../game/world/types.ts'

export * from './types'

const ColorScheme = makeColorScheme()

export const resolveFloorColor = (params: FloorColorParams) => {
  ColorScheme.moveLightnessRange(params.lightnessMoveDelta)
  ColorScheme.increaseSaturation(params.saturationDelta, params.maxSaturation)
}

const ColorMagnifyValues: Record<Atmosphere, number> = {
  [Atmosphere['atmospheric']]: 2.0,
  [Atmosphere['smooth']]: 0.8,
  [Atmosphere['ambient']]: 0.5,
  [Atmosphere['digital']]: 0.2,
  [Atmosphere['abstract']]: 0,
}

export const resolveFrameColor = (params: FrameColorParams, atmosphere: Atmosphere) => {
  // hue
  ColorScheme.rotateHue(params.hueDelta * 180)

  // apply material color
  const col = ColorScheme.materialColor.clone()
  col.lightness *= ColorMagnifyValues[atmosphere]
  getMaterial().setColor(col)

  return {
    unlitColor: ColorScheme.unlitColor,
  }
}

export const resetColors = () => ColorScheme.resetColors()
