import { randomIntInclusiveBetween } from 'utils'
import { IColorScheme } from './types.ts'
import { Color } from 'maze-gl'

const defaultHue = randomIntInclusiveBetween(120, 359)
const defaultSaturation = 0.4 // 0.0

// lit
const defaultUnlitLightness = 0.1 // 0.0
const lightnessRangeToAvoid = {
  min: 0.45,
  max: 0.55,
}
const litInversionThreshold = 0.5

const materialLightness = 0.3 // 0.1

Color.MaxSaturation = 0.33

export const makeColorScheme = (): IColorScheme => {
  const unlitColor = new Color(defaultHue, defaultSaturation, defaultUnlitLightness)
  const materialColor = new Color(defaultHue, defaultSaturation, materialLightness)

  const resetColors = () => {
    unlitColor.saturation = defaultSaturation
    unlitColor.lightness = defaultUnlitLightness
    materialColor.saturation = defaultSaturation
    materialColor.lightness = materialLightness
  }

  const moveLightnessRange = (delta: number): void => {
    unlitColor.lightness += delta

    if (
      unlitColor.lightness > lightnessRangeToAvoid.min &&
      unlitColor.lightness < lightnessRangeToAvoid.max
    ) {
      moveLightnessRange(delta)
    }
  }

  const isLitInverted = () => unlitColor.normalizedRGB.every((v) => v > litInversionThreshold)

  const increaseSaturation = (delta: number, max = 1.0): void => {
    Color.MaxSaturation = max;
    unlitColor.saturation += delta
    materialColor.saturation += delta
  }

  const rotateHue = (degrees: number): void => {
    unlitColor.rotateHue(degrees)
    materialColor.rotateHue(degrees)
  }

  return {
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
    resetColors,
  }
}
