import { makeColorScheme } from './scheme.ts'
import { getColorMaterial } from '../mesh/material'
import { randomFloatInAsymmetricRange } from 'utils'

export * from './types'

const ColorScheme = makeColorScheme()

export const applyMaterialColor = () => {
  getColorMaterial('default').setColor(ColorScheme.materialColor)
  getColorMaterial('octahedron').setColor(ColorScheme.materialColor)
}

// TODO: pass in domain intention here
export const resolveColor = (...colorValues: unknown[]) => {

  // do something with the color values

  ColorScheme.rotateHue(1)

  const delta = randomFloatInAsymmetricRange(0.05)
  ColorScheme.increaseLitLevel(delta)

  // const delta2 = randomFloatInAsymmetricRange(0.01)
  // ColorScheme.moveLightnessRange(0.01)

  // apply material color
  applyMaterialColor()

  return {
    lightColor: ColorScheme.lightColor,
    unlitColor: ColorScheme.unlitColor,
  }
}
