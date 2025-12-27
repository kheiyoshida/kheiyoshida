import { ScreenEffectNode } from '../node'
import { EdgeRenderingEffect, EdgeRenderingEffectParams } from './model'

export class EdgeRenderingNode extends ScreenEffectNode {
  constructor() {
    super(new EdgeRenderingEffect())
  }

  updateParams(params: EdgeRenderingEffectParams) {
    const fx = this.effect as EdgeRenderingEffect
    fx.updateParams(params)
  }
}
