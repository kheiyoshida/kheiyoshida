import { Color } from 'maze-gl'

export type IColorScheme = {
  /**
   * the base color for anything unlit (background, unlit objects).
   * light calculation result adds up to this color:
   *
   * in short:
   * color = unlitColor + (material * light)
   *
   */
  readonly unlitColor: Color

  /**
   * another half part of "delta" to the final color result.
   */
  readonly materialColor: Color

  /**
   * if lighting is inverted, the flag would be true
   */
  readonly litInversion: boolean

  /**
   * rotate the scheme's hue
   * @param degrees
   */
  rotateHue(degrees: number): void

  /**
   * increase overall saturation
   */
  increaseSaturation(delta: number, max?: number): void

  /**
   * make the color range lighter or darker
   */
  moveLightnessRange(delta: number): void

  /**
   * reset colors to default starting values
   */
  resetColors(): void
}
