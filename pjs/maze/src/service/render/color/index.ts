import { makeColorScheme } from './scheme.ts'
import { getColorMaterial } from '../mesh/material'
import { FloorColorParams, FrameColorParams } from '../../../domain/query/vision/color/types.ts'

export * from './types'

const ColorScheme = makeColorScheme()

export const applyMaterialColor = () => {
  getColorMaterial('default').setColor(ColorScheme.materialColor)
  getColorMaterial('distinct').setColor(ColorScheme.materialColor)
}

export const resolveFloorColor = (params: FloorColorParams) => {
  ColorScheme.moveLightnessRange(params.lightnessMoveDelta)
  ColorScheme.increaseSaturation(params.saturationDelta, params.maxSaturation)
}

export const resolveFrameColor = (params: FrameColorParams) => {
  // hue
  ColorScheme.rotateHue(params.hueDelta * 180)

  // lightness
  ColorScheme.setLightLevel(params.litLevel * 0.4)

  // apply material color
  applyMaterialColor()

  return {
    lightColor: ColorScheme.lightColor,
    unlitColor: ColorScheme.unlitColor,
  }
}

export const resetColors = () => ColorScheme.resetColors()
