import { ScreenEffectNode } from '../node'
import { FadeEffect } from './model'
import { FadeParams } from '../../../models'

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
