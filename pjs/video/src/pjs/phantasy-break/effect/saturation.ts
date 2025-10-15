import vert from './saturation.vert?raw'
import frag from './saturation.frag?raw'
import { Shader } from '../../../gl/shader'
import { ScreenEffectModel } from '../../../lib/effect/slot'
import { randomFloatBetween } from 'utils'
import { RangedValue } from '../utils/rangedValue'

export class ColorEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
  }

  private _luminanceCap = 0.8
  public get luminanceCap() {
    return this._luminanceCap
  }
  public set luminanceCap(value: number) {
    this._luminanceCap = value
    this.shader.use()
    this.shader.setUniformFloat('uLuminanceCap', this._luminanceCap)
  }

  private _luminanceBase = 0.01
  public get luminanceBase() {
    return this._luminanceBase
  }
  public set luminanceBase(value: number) {
    this._luminanceBase = value
    this.shader.use()
    this.shader.setUniformFloat('uLuminanceBase', this._luminanceBase)
  }

  public saturationOffset: [number, number, number] = [0, 0, 0]

  private _saturation: [number, number, number] = [1, 1, 1]
  public get saturation() {
    return this._saturation
  }
  public set saturation(value: [number, number, number]) {
    this._saturation = value
    this.shader.use()
    this.shader.setUniform3fv('uSaturation', [
      this._saturation[0] + this.saturationOffset[0],
      this._saturation[1] + this.saturationOffset[1],
      this._saturation[2] + this.saturationOffset[2],
    ])
  }

  public saturationOffsetLevel = new RangedValue(0, 0.1, 0, 1)
  public moveSaturation(rand: number) {
    const max = this.saturationOffsetLevel.updateValue(rand)
    this.saturationOffset = [randomFloatBetween(0, max), randomFloatBetween(0, max), randomFloatBetween(0, max)]
    this.saturation = this._saturation
  }

  public enableSaturation(flag: boolean): void {
    this.shader.use()
    this.shader.setUniformInt('uEnableSaturation', flag ? 1 : 0)
  }

  public useMonotone(flag: boolean): void {
    this.shader.use()
    this.shader.setUniformInt('uMonotone', flag ? 1 : 0)
  }
}
