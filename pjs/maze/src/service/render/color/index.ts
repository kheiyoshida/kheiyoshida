import { makeColorScheme } from './scheme.ts'
import { getColorMaterial } from '../mesh/material'
import { FloorColorParams, FrameColorParams } from '../../../domain/query/color/types.ts'

export * from './types'

const ColorScheme = makeColorScheme()

export const applyMaterialColor = () => {
  getColorMaterial('default').setColor(ColorScheme.materialColor)
  getColorMaterial('octahedron').setColor(ColorScheme.materialColor)
}

export const resolveFloorColor = (params: FloorColorParams) => {
  ColorScheme.moveLightnessRange(params.lightnessMoveDelta)
  ColorScheme.increaseSaturation(params.saturationDelta, params.maxSaturation)

 console.log(ColorScheme.unlitColor.values)
}

const params: FloorColorParams = {
  lightnessMoveDelta: 0.2,
  maxSaturation: 0.8,
  saturationDelta: 0.1,
}
resolveFloorColor(params)

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
