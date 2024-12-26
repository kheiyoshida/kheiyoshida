import { makeColorScheme } from './scheme.ts'
import { getMeshMaterial } from '../mesh/material'
import { FloorColorParams, FrameColorParams } from '../../../domain/query/vision/color/types.ts'
import { RenderingMode } from '../../../domain/entities/maze/stages'

export * from './types'

const ColorScheme = makeColorScheme()

export const applyMaterialColor = (mode: RenderingMode) => {
  getMeshMaterial('default', mode).setColor(ColorScheme.materialColor)
  getMeshMaterial('distinct', mode).setColor(ColorScheme.materialColor)
}

export const resolveFloorColor = (params: FloorColorParams) => {
  ColorScheme.moveLightnessRange(params.lightnessMoveDelta)
  ColorScheme.increaseSaturation(params.saturationDelta, params.maxSaturation)
}

export const resolveFrameColor = (params: FrameColorParams, mode: RenderingMode) => {
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
