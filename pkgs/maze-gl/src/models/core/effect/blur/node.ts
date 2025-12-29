import { BlurDir, BlurEffect, BlurParams } from './model'
import { ScreenEffectNode } from '../node'
import { EffectParams } from '../index'

export class BlurNode extends ScreenEffectNode {
  constructor(dir: BlurDir) {
    super(new BlurEffect(dir))
  }

  updateParams(params: EffectParams) {
    const fx = this.effect as BlurEffect
    if (params.blur) {
      this.enabled = true
      fx.updateParams(params.blur)
    }
    else this.enabled = false
  }
}
