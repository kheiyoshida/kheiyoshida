import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './edge.frag?raw'
import { EdgeRenderingParams, Shader } from '../../../models'
import { bindUBO } from '../../../models/uniformBlock'

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
