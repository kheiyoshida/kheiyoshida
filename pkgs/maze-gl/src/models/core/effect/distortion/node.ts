import { ScreenEffectNode } from '../node'
import { DistortionEffect } from './model'
import { EffectParams } from '../index'

export class DistortionNode extends ScreenEffectNode {
  constructor() {
    super(new DistortionEffect())
  }

  updateParams(params: EffectParams): void {
    const fx = this.effect as DistortionEffect
    if (params.distortion) {
      this.enabled = true
      fx.updateParams(params.distortion)
    }
    else this.enabled = false
  }
}
