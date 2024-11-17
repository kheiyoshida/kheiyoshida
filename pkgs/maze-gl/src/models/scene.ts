import { RenderUnit } from './unit'
import { Vector } from './geometry'

export type Scene = {
  units: RenderUnit[]
  eye: Eye
}

export type Eye = {
  /**
   * in-game logical position
   */
  position: Vector
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