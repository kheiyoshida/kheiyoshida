import { RGB, Vector3D } from 'maze-gl'
import { ScreenEffectParams } from '../../../../integration/query'

export type SharedScreenParams = {
  /**
   * screen resolution. x for width, y for height
   */
  resolution: Vector3D

  /**
   * normalized rgb values to specify the 'background' color of the screen
   */
  baseColor: RGB

  /**
   * float in between 0 - 1
   *
   * specifies the amount of fadeout.
   * 0 applies no fade, 1 blacks out the screen
   */
  fadeoutPercentage: number
}

export type ConcreteScreenEffectParams = SharedScreenParams & ScreenEffectParams
