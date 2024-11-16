import { RenderUnit } from './unit'
import { Vector } from './geometry'

export type Scene = {
  units: RenderUnit[]
  eye: Eye
}

export type Eye = {
  position: Vector
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
