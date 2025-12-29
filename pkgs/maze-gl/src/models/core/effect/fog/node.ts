import { ScreenEffectNode } from '../node'
import { FogEffect, FogParams } from './model'

export class FogEffectNode extends ScreenEffectNode {
  constructor() {
    super(new FogEffect())
  }

  updateParams(params?: FogParams) {
    if (params) {
      this.enabled = true
      const fx = this.effect as FogEffect
      fx.updateParams(params)
    }
    this.enabled = false
  }
}
