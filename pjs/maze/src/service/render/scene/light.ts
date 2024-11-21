import { Position3D } from 'p5utils/src/3d'
import { randomIntInAsymmetricRange, randomIntInclusiveBetween } from 'utils'
import { LightVariables } from '../../../domain/translate/light'
import { makeColorManager, RGB } from '../color'
import { Colors } from '../color/colors.ts'
import { Eye, PointLightValues, Scene, SpotLightValues } from 'maze-gl'

const MinFallOff = 50
const DefaultFallOff = 250

export const LightColorManager = makeColorManager(Colors.white, () => [
  randomIntInclusiveBetween(200, 250),
  randomIntInclusiveBetween(200, 250),
  randomIntInclusiveBetween(200, 250),
])

export const triggerFadeOut = (frames: number) => {
  LightColorManager.setFixedOperation(['fadeout', frames], frames)
}

export const getLights = (
  {position, direction}: Eye,
  light: LightVariables
): Scene['lights'] => {
  LightColorManager.resolve(light.colorParams)
  // const linearFallOff = calcLightFalloff(light.visibility)
  const linearFallOff = 1.0
  console.log(linearFallOff)

  const diffuseColor = LightColorManager.currentRGB.map(v => v/255 / 10) as RGB
  // const diffuseColor = [0.1, 0.1, 0.1] as RGB
  const ambientColor = [0.1, 0.1, 0.1] as RGB
  const specularColor = [0.01, 0.01, 0.01] as RGB

  const pointLight1: PointLightValues = {
    position,

    ambient: ambientColor,
    diffuse: diffuseColor,
    specular: specularColor,

    constant: 0.8,
    linear: linearFallOff,
    quadratic: 0.0001,
  }

  const pointLight2: PointLightValues = {
    ...pointLight1,
    position: [position[0], position[1], position[2] + randomIntInAsymmetricRange(20)],
  }

  const spotLight: SpotLightValues = {
    position: position,
    direction: [0.0, 0.0, -1.0], // TODO: calculate directional vector

    ambient: ambientColor,
    diffuse: diffuseColor,
    specular: specularColor,

    cutOff: 19,
    outerCutOff: 30,

    constant: 0.1,
    linear: linearFallOff,
    quadratic: 0.001,
  }

  return {
    pointLights: [pointLight1, pointLight2],
    spotLight,
  }
}

/**
 * @deprecated we don't use this anymore as we migrate to MazeGL from p5
 */
export const handleLight = (
  cameraPosition: Position3D,
  directionalPosition: Position3D,
  light: LightVariables
) => {
  LightColorManager.resolve(light.colorParams)
  const falloff = calcLightFalloff(light.visibility)
  p.lightFalloff(0.5, falloff, 0)

  const pointLightColor = LightColorManager.currentRGB
  p.spotLight(
    ...pointLightColor,
    ...cameraPosition,
    ...directionalPosition,
    Math.PI * 10,
    30
  )
  p.pointLight(...pointLightColor, ...cameraPosition)

  p.pointLight(
    ...pointLightColor,
    cameraPosition[0],
    cameraPosition[1],
    cameraPosition[2] - randomIntInAsymmetricRange(20)
  )
}

const calcLightFalloff = (visibility = 1.0) => {
  return 1 / (MinFallOff + DefaultFallOff * visibility)
}
