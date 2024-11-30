import { randomIntInAsymmetricRange, toRadians } from 'utils'
import { LightVariables } from '../../../domain/translate/light'
import { RGB } from '../color'
import { Color, Eye, PointLightValues, Scene, SpotLightValues, Vector3D } from 'maze-gl'

const MinFallOff = 50
const DefaultFallOff = 50

export const triggerFadeOut = (frames: number) => {
  // LightColorManager.setFixedOperation(['fadeout', frames], frames)
}

export const getLights = ({ position, direction }: Eye, lightColor: Color, light: LightVariables): Scene['lights'] => {

  const diffuseColor = lightColor.normalizedRGB
  const specularColor = lightColor.clone().fixLightness(lightColor.lightness - 0.1).normalizedRGB

  lightColor.lightness = 0.01
  const ambientColor = lightColor.normalizedRGB

  const pointLight1: PointLightValues = {
    position,

    ambient: ambientColor,
    diffuse: diffuseColor,
    specular: specularColor,

    // TODO: calculate falloff values based on light variables
    constant: 0.5,
    linear: 0.5,
    quadratic: 0.8,
  }

  const pointLight2: PointLightValues = {
    ...pointLight1,
    position: [position[0], position[1], position[2] + randomIntInAsymmetricRange(20)],
  }

  const spotLight: SpotLightValues = {
    position: position,
    direction: calcDirectionalVector(direction),

    ambient: ambientColor,
    diffuse: diffuseColor,
    specular: [0.1, 0.1, 0.1],

    cutOff: 2,
    outerCutOff: 50,

    constant: 1.0,
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
