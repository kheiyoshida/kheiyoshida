import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './edge.frag?raw'
import { EdgeRenderingParams, Shader } from '../../../models'
import { bindUBO } from '../../../models/uniformBlock'

export class EdgeRenderingEffect extends ScreenEffectModel {
  constructor() {
    const shader = new Shader(vert, frag)
    super(shader)
    bindUBO(shader.program, 'Color')
    bindUBO(shader.program, 'Effect')
  }

  updateParams(params: EdgeRenderingParams) {
    if (!this.enabled) return;
    this.shader.use()
    this.shader.setUniformFloat('uEdgeRenderingLevel', params.edgeRenderingLevel)
  }
}
