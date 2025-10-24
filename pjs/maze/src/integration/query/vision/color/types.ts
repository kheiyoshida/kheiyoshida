import { Level } from '../../utils/types.ts'

export type ColorParams = {
  /**
   * params for color changes that occur at each floor
   */
  floor: FloorColorParams

  /**
   * params for color changes that occur at every frame
   */
  frame: FrameColorParams
}

export type FloorColorParams = {
  /**
   * the maximum saturation level service can randomly change the value up to
   */
  maxSaturation: Level

  /**
   * change delta for overall lightness
   */
  lightnessMoveDelta: Level

  /**
   * the amount saturation should change
   */
  saturationDelta: Level
}

export type FrameColorParams = {
  /**
   * how much terrain should be lit by lights
   */
  litLevel: Level

  /**
   * the level of hue change:
   * - 1.0: maximum rotation (to the opposite color)
   */
  hueDelta: Level
}
