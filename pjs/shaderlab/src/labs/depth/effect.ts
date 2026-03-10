import { ScreenEffectModel } from '../../lib/effect/effect.ts'
import vert from '../../lib/effect/default.vert?raw'
import frag from './depthLine.frag?raw'
import { getGL, Shader } from 'graph-gl'
import { ScreenEffectNode } from '../../lib/effect/node.ts'

export class DepthLineEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
  }

  public setResolution(width: number, height: number) {
    this.shader.use()
    this.shader.setUniformFloat2('uResolution', width, height)
  }
}

export class DepthEffectNode extends ScreenEffectNode {
  constructor() {
    const fx = new DepthLineEffect()
    fx.setResolution(getGL().canvas.width, getGL().canvas.height)
    super(fx)
  }
}
