import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './edge.frag?raw'
import { bindUBO } from '../../../supporting/uniformBlock'
import { Shader } from 'graph-gl'

export type EdgeRenderingParams = {
  edgeRenderingLevel: number
}

export class EdgeRenderingEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
    bindUBO(this.shader.program, 'Color')
    bindUBO(this.shader.program, 'Effect')
  }

  updateParams(params: EdgeRenderingParams) {
    this.shader.use()
    this.shader.setUniformFloat('uEdgeRenderingLevel', params.edgeRenderingLevel)
  }
}
