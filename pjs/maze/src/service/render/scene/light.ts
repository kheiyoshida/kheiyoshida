import { randomIntInAsymmetricRange, toRadians } from 'utils'
import { LightVariables } from '../../../domain/query/light'
import { Color, Eye, PointLightValues, Scene, SpotLightValues, Vector3D } from 'maze-gl'

type Fade = {
  in?: number
  out?: number
}

export const getLights = (
  { position, direction }: Eye,
  lightColor: Color,
  light: LightVariables,
  fade?: Fade
): Scene['lights'] => {
  // colors
  const diffuseColor = lightColor.clone()
  const specularColor = lightColor.clone()
  const ambientColor = lightColor.clone()

  // set specific lightness for each component
  specularColor.lightness -= 0.1
  ambientColor.lightness = 0.01

  // get concrete rgb values for shader
  const diffuseRGB = diffuseColor.normalizedRGB
  const specularRGB = specularColor.normalizedRGB
  const ambientRGB = ambientColor.normalizedRGB

  // light
  const lightness = lightColor.lightness

  const maxFalloff = Math.max(lightness, 0.1)
  const linearFalloff = maxFalloff * (1 - light.nearVisibility)

  const minConstant = Math.max(lightness, 0.3)
  const maxConstant = minConstant + 0.2
  const constantFalloff = minConstant + light.farVisibility * (maxConstant - minConstant)
  const constant =fade ? calcFadeInOut(fade, constantFalloff) : constantFalloff

  const pointLight1: PointLightValues = {
    position,
    ambient: ambientRGB,
    diffuse: diffuseRGB,
    specular: specularRGB,

    constant: constant,
    linear: linearFalloff,
    quadratic: 0.01,
  }

  const pointLight2: PointLightValues = {
    ...pointLight1,
    position: [position[0], position[1], position[2] + randomIntInAsymmetricRange(20)],
  }

  const spotLight: SpotLightValues = {
    position: position,
    direction: calcDirectionalVector(direction),

    ambient: ambientRGB,
    diffuse: diffuseRGB,
    specular: [0.1, 0.1, 0.1],

    cutOff: 2,
    outerCutOff: 50,

    constant: constant,
    linear: 1.5,
    quadratic: 0.48,
  }

  return {
    pointLights: [pointLight1, pointLight2],
    spotLight,
  }
}

const calcDirectionalVector = (delta: number): Vector3D => {
  const theta = Math.PI / 2 - toRadians(delta)
  return [Math.cos(theta), 0, -Math.sin(theta)]
}

const darkConstantFalloff = 30.0
const calcFadeInOut = (fade: Fade, constant: number): number => {
  const diff = Math.abs(darkConstantFalloff - constant)
  if (fade.in !== undefined) {
    return darkConstantFalloff - fade.in * diff
  }
  if (fade.out !== undefined) {
    return constant + fade.out * diff
  }
  throw Error(`unexpected`)
}
