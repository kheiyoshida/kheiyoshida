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
   * in-game logical direction in degrees
   * (front = 0, in range of +-90)
   */
  direction: Vector
  /**
   * in radians
   */
  fov: number
  /**
   * in distance
   */
  sight: number
}
