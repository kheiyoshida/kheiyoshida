import { ScreenEffectModel } from '../model'
import { DistortionParams, Shader } from '../../../models'
import vert from '../shared/screen.vert?raw'
import frag from './distortion.frag?raw'
import { bindUBO } from '../../../models/uniformBlock'

export class DistortionEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
    bindUBO(this.shader.program, 'Effect')
  }

  updateParams(params: DistortionParams) {
    this.shader.use()
    this.shader.setUniformFloat('uRandomizationLevel', params.distortionLevel)
  }
}
