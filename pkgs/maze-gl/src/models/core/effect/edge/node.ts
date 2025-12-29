import { ScreenEffectNode } from '../node'
import { EdgeRenderingEffect } from './model'
import { EffectParams } from '../index'

export class EdgeRenderingNode extends ScreenEffectNode {
  constructor() {
    super(new EdgeRenderingEffect())
  }

  updateParams(params: EffectParams) {
    const fx = this.effect as EdgeRenderingEffect
    if (params.edge) {
      this.enabled = true
      fx.updateParams(params.edge)
    }
    else this.enabled = false
  }
}
