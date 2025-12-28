import { ScreenEffectNode } from '../node'
import { DistortionEffect } from './model'
import { DistortionParams } from '../../../models'

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
