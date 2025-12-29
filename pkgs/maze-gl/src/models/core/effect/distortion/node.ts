import { ScreenEffectNode } from '../node'
import { DistortionEffect, DistortionParams } from './model'

export class DistortionNode extends ScreenEffectNode {
  constructor() {
    super(new DistortionEffect())
  }

  updateParams(params?: DistortionParams) {
    const fx = this.effect as DistortionEffect
    if (params) {
      this.enabled = true
      fx.updateParams(params)
    }
    else this.enabled = false
  }
}
