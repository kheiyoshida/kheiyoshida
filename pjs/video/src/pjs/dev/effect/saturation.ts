import vert from './saturation.vert?raw'
import frag from './saturation.frag?raw'
import { Shader } from '../../../gl/shader'
import { ScreenEffectModel } from '../../../lib/effect/slot'

export class ColorEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
  }

  private _saturation: [number, number, number] = [1, 1, 1]
  public get saturation() {
    return this._saturation
  }
  public set saturation(value: [number, number, number]) {
    this._saturation = value
    this.shader.use()
    this.shader.setUniform3fv('uSaturation', this._saturation)
  }

  private _cap: [number, number, number] = [1, 1, 1]
  public get cap() {
    return this._cap
  }
  public set cap(value: [number, number, number]) {
    this._cap = value
    this.shader.use()
    this.shader.setUniform3fv('uCap', this._cap)
  }
}
