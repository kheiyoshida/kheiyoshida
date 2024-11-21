import { Vector } from './geometry'

// TODO: move this type somewhere appropriate
type Color = Vector

export type LightValues = {
  constant: number
  linear: number
  quadratic: number

  ambient: Color
  diffuse: Color
  specular: Color
}

export type PointLightValues = {
  position: Vector
} & LightValues

export type SpotLightValues = {
  /**
   * in-game logical position
   */
  position: Vector

  /**
   * direction of spotlight
   */
  direction: Vector

  /**
   * inner cone, in degrees
   */
  cutOff: number

  /**
   * outer cone, in degrees
   */
  outerCutOff: number
} & LightValues
