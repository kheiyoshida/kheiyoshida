import { Vector3D, Color } from '../vector'

export type LightValues = {
  constant: number
  linear: number
  quadratic: number

  ambient: Color
  diffuse: Color
  specular: Color
}

export type PointLightValues = {
  position: Vector3D
} & LightValues

export type SpotLightValues = {
  /**
   * in-game logical position
   */
  position: Vector3D

  /**
   * direction of spotlight
   */
  direction: Vector3D

  /**
   * inner cone, in degrees
   */
  cutOff: number

  /**
   * outer cone, in degrees
   */
  outerCutOff: number
} & LightValues
