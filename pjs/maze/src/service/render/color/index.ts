import { makeColorScheme } from './scheme.ts'
import { getMeshMaterial } from '../object/material'
import { FloorColorParams, FrameColorParams } from '../../../integration/query/vision/color/types.ts'

import { Atmosphere } from '../../../game/world'

export * from './types'

const ColorScheme = makeColorScheme()

export const applyMaterialColor = (mode: Atmosphere) => {
  getMeshMaterial('default', mode).setColor(ColorScheme.materialColor)
  getMeshMaterial('distinct', mode).setColor(ColorScheme.materialColor)
}

export const resolveFloorColor = (params: FloorColorParams) => {
  ColorScheme.moveLightnessRange(params.lightnessMoveDelta)
  ColorScheme.increaseSaturation(params.saturationDelta, params.maxSaturation)
}

export const resolveFrameColor = (params: FrameColorParams, mode: Atmosphere) => {
  // hue
  ColorScheme.rotateHue(params.hueDelta * 180)

  // lightness
  ColorScheme.setLightLevel(params.litLevel * 0.4)

  // apply material color
  applyMaterialColor(mode)

  return {
    lightColor: ColorScheme.lightColor,
    unlitColor: ColorScheme.unlitColor,
  }
}

export const resetColors = () => ColorScheme.resetColors()
