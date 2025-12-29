import { ScreenEffectNode } from '../node'
import { FogEffect } from './model'
import { EffectParams } from '../index'

export class FogEffectNode extends ScreenEffectNode {
  constructor() {
    super(new FogEffect())
  }

  updateParams(params: EffectParams) {
    if (params.fog) {
      this.enabled = true
      const fx = this.effect as FogEffect
      fx.updateParams(params.fog)
    }
    this.enabled = false
  }
}
