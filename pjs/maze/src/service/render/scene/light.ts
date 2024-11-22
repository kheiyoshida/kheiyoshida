import { Position3D, toRadians } from 'p5utils/src/3d'
import { randomIntInAsymmetricRange, randomIntInclusiveBetween } from 'utils'
import { LightVariables } from '../../../domain/translate/light'
import { makeColorManager, RGB } from '../color'
import { Colors } from '../color/colors.ts'
import { Eye, PointLightValues, Scene, SpotLightValues, Vector } from 'maze-gl'

const MinFallOff = 50
const DefaultFallOff = 50

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
  const linearFallOff = calcLightFalloff(light.visibility)

  const diffuseColor = LightColorManager.currentRGB.map(v => v/255 / 10) as RGB
  // const diffuseColor = [0.1, 0.1, 0.1] as RGB
  const ambientColor = [0.01, 0.01, 0.01] as RGB
  const specularColor = [0.01, 0.01, 0.01] as RGB

  const pointLight1: PointLightValues = {
    position,

    ambient: ambientColor,
    diffuse: diffuseColor,
    specular: specularColor,

    constant: 0.5,
    linear: linearFallOff,
    quadratic: 0.4,
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
    specular: [0.1,0.1,0.1],

    cutOff: 2,
    outerCutOff: 50,

    constant: 1.0,
    linear: 1.0,
    quadratic: 0.1,
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
  return 50 / (MinFallOff + DefaultFallOff * visibility)
}

const calcDirectionalVector = (delta: number): Vector => {
  const theta = Math.PI/2 - toRadians(delta)
  return [Math.cos(theta), 0, -Math.sin(theta)]
}
