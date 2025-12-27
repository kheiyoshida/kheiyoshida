import { RenderUnit } from './unit'
import { Vector3D } from '../vector'
import { PointLightValues, SpotLightValues } from './light'
import { Color } from '../color'
import { Effect } from './effect'
import { ScreenEffect } from './screenEffect/screenEffect'

export type Scene = {
  eye: Eye
  units: RenderUnit[]
  unlitColor: Color
  effect: Effect
  screenEffect?: ScreenEffect
}

export type SceneLights = {
  pointLights: [PointLightValues, PointLightValues]
  spotLight: SpotLightValues
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
