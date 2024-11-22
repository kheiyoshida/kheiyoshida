import { PointLightValues, SpotLightValues } from '../models/light'
import { Scene, Vector } from '../models'
import { positionToNDC } from './scale'
import { toRadians } from '../utils/calc'

const vec3pad = (v: Vector) => [...v, 0.0]
const floatPad = (f: number) => [f, 0.0, 0.0, 0.0]

// TODO: test ubo layout140 constraints

export const convertLightsToUboData = (lights: Scene['lights'], viewPos: Vector): Float32Array => {
  return new Float32Array([
    ...formatPointLight(lights.pointLights[0]),
    ...formatPointLight(lights.pointLights[1]),
    ...formatSpotLight(lights.spotLight),
    ...vec3pad(positionToNDC(viewPos)),
  ])
}

const formatPointLight = (light: PointLightValues): number[] => {
  return [
    ...vec3pad(positionToNDC(light.position)),

    ...vec3pad(light.ambient),
    ...vec3pad(light.diffuse),
    ...vec3pad(light.specular),

    // floats occupy 4 bytes each
    light.constant,
    light.linear,
    light.quadratic,
    0.0, // last pad to make it align with 16-bytes elements
  ]
}

const formatSpotLight = (light: SpotLightValues): number[] => {
  return [
    ...vec3pad(positionToNDC(light.position)),
    ...vec3pad(light.direction),

    ...vec3pad(light.ambient),
    ...vec3pad(light.diffuse),
    ...vec3pad(light.specular),

    ...floatPad(toRadians(light.cutOff)),
    ...floatPad(toRadians(light.outerCutOff)),

    ...floatPad(light.constant),
    ...floatPad(light.linear),
    ...floatPad(light.quadratic),
  ]
}

export const debugUBOData = (lightsUBOData: ReturnType<typeof convertLightsToUboData>) => {
  let debug = ``
  for (let i = 0; i < lightsUBOData.length; i++) {
    if (i % 4 === 0) {
      debug += `\n`
    }
    debug += `${lightsUBOData[i]} `
  }
  // eslint-disable-next-line no-console
  console.log(debug)
}
