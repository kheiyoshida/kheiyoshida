import { BlurDir, BlurEffect, BlurParams } from './model'
import { ScreenEffectNode } from '../node'

export class BlurNode extends ScreenEffectNode {
  constructor(dir: BlurDir) {
    super(new BlurEffect(dir))
  }

  updateParams(params?: BlurParams) {
    const fx = this.effect as BlurEffect
    if (params) {
      this.enabled = true
      fx.updateParams(params)
    }
    else this.enabled = false
  }
}
