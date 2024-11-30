import { clamp, randomIntInclusiveBetween } from 'utils'
import { IColorScheme } from './types.ts'
import { Color } from 'maze-gl'

const defaultHue = randomIntInclusiveBetween(0, 359)
const defaultSaturation = 0.0 // 0.0

// lit
const defaultUnlitLightness = 0.0 // 0.0
const defaultLitDelta = 0.3 // 0.1
const materialLightness = 0.1 // 0.1

const litInversionThreshold = 0.5

const minLightnessSum = 0.1
const maxLightnessSum = 0.6

export const makeColorScheme = (): IColorScheme => {
  const unlitColor = new Color(defaultHue, defaultSaturation, defaultUnlitLightness)
  const lightColor = new Color(defaultHue, defaultSaturation, defaultLitDelta)
  const materialColor = new Color(defaultHue, defaultSaturation, materialLightness)

  const moveLightnessRange = (delta: number): void => {
    unlitColor.lightness += delta
    const minLightness = Math.max(minLightnessSum - unlitLightnessLevel(), 0.01)
    lightColor.lightness = clamp(lightColor.lightness - delta, minLightness, 1.0)
  }

  const unlitLightnessLevel = () =>
    unlitColor.lightness > litInversionThreshold ? 1 - unlitColor.lightness : unlitColor.lightness

  const increaseLitLevel = (delta: number): void => {
    const availableLightness =
      maxLightnessSum - unlitLightnessLevel() - materialColor.lightness - lightColor.saturation /2
    const minLightness = Math.max(minLightnessSum - unlitLightnessLevel(), 0.01)
    lightColor.lightness = clamp(lightColor.lightness + delta, minLightness, availableLightness)
  }

  const isLitInverted = () => unlitColor.normalizedRGB.every((v) => v > litInversionThreshold)

  const increaseSaturation = (delta: number, max = 1.0): void => {
    const saturation = clamp(delta, 0, max)
    unlitColor.saturation = saturation
    lightColor.saturation = saturation
    materialColor.saturation = saturation
  }

  const rotateHue = (degrees: number): void => {
    unlitColor.rotateHue(degrees)
    lightColor.rotateHue(degrees)
    materialColor.rotateHue(degrees)
  }

  return {
    get lightColor() {
      return lightColor.clone()
    },
    get litInversion() {
      return isLitInverted()
    },
    get materialColor() {
      return materialColor.clone()
    },
    get unlitColor() {
      return unlitColor.clone()
    },
    increaseSaturation,
    moveLightnessRange,
    rotateHue,
    increaseLitLevel,
    fadeInLight(): void {
      // TODO: implement
    },
    fadeOutLight(): void {
      // TODO: implement
    },
  }
}
