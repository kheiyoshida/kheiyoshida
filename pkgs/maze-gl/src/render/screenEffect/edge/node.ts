import { ScreenEffectNode } from '../node'
import { EdgeRenderingEffect } from './model'
import { EdgeRenderingParams } from '../../../models'

export class EdgeRenderingNode extends ScreenEffectNode {
  constructor() {
    super(new EdgeRenderingEffect())
  }

  updateParams(params?: EdgeRenderingParams) {
    const fx = this.effect as EdgeRenderingEffect
    if (params) fx.updateParams(params)
    else fx.enabled = false
  }
}
