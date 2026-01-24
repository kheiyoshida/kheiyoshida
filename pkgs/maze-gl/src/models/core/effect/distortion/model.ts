import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './distortion.frag?raw'
import { bindUBO } from '../../../supporting/uniformBlock'
import { Shader } from 'graph-gl'

export type DistortionParams = {
  distortionLevel: number
}

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
