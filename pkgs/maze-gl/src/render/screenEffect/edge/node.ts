import { ScreenEffectNode } from '../node'
import { EdgeRenderingEffect } from './model'
import { EdgeRenderingParams } from '../../../models'

export class EdgeRenderingNode extends ScreenEffectNode {
  constructor() {
    super(new EdgeRenderingEffect())
  }

  updateParams(params?: EdgeRenderingParams) {
    const fx = this.effect as EdgeRenderingEffect
    if (params) {
      this.enabled = true
      fx.updateParams(params)
    }
    else this.enabled = false
  }
}
