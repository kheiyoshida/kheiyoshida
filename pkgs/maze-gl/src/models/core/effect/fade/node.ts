import { ScreenEffectNode } from '../node'
import { FadeEffect, FadeParams } from './model'
import { EffectParams } from '../index'

export class FadeNode extends ScreenEffectNode {
  constructor() {
    super(new FadeEffect())
  }

  updateParams(params: EffectParams) {
    if (params.fade) {
      this.enabled = true
      const fx = this.effect as FadeEffect
      fx.updateParams(params.fade)
    } else this.enabled = false
  }
}
