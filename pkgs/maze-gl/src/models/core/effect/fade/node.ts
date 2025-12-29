import { ScreenEffectNode } from '../node'
import { FadeEffect, FadeParams } from './model'

export class FadeNode extends ScreenEffectNode {
  constructor() {
    super(new FadeEffect())
  }

  updateParams(params?: FadeParams) {
    if (params) {
      this.enabled = true
      const fx = this.effect as FadeEffect
      fx.updateParams(params)
    } else this.enabled = false
  }
}
