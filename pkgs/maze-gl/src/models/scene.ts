import { RenderUnit } from './unit'
import { Vector3D } from '../vector'
import { Color } from '../color'

export type Scene = {
  eye: Eye
  units: RenderUnit[]
  baseColor: Color
  effect: EffectParams
}

export type Eye = {
  /**
   * in-game logical position
   */
  position: Vector3D
  /**
   * in-game logical direction in degrees (front = 0 degree)
   * pass in positive values to turn right
   */
  direction: number
  /**
   * field of view angle in radians
   */
  fov: number
  /**
   * the end of sight in in-game logical distance
   */
  sight: number

  /**
   * usually width/height, but can be adjusted
   */
  aspectRatio: number
}

export type EffectParams = {
  time: number
  resolution: [number, number]
  edge?: EdgeRenderingParams
  fog?: FogParams
  blur?: BlurParams
  distortion?: DistortionParams
  fade?: FadeParams
}

export type EdgeRenderingParams = {
  edgeRenderingLevel: number
}

export type FogParams = {
  fogLevel: number
}

export type BlurParams = {
  blurLevel: number
}

export type DistortionParams = {
  distortionLevel: number
}

export type FadeParams = {
  fadeLevel: number
}
