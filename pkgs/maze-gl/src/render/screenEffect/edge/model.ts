import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './edge.frag?raw'
import { Shader } from '../../../models'

export type EdgeRenderingEffectParams = {
  time: number
  edgeRenderingLevel: number
}

export class EdgeRenderingEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
  }

  updateParams(params: EdgeRenderingEffectParams) {
    this.shader.use()
    this.shader.setUniformFloat('uTime', params.time)
    this.shader.setUniformFloat('uEdgeRenderingLevel', params.edgeRenderingLevel)
  }
}
