import { ScreenEffectModel } from '../model'
import { BlurParams, Shader } from '../../../models'
import vert from '../shared/screen.vert?raw'
import fragVert from './blurVert.frag?raw'
import fragHori from './blurHori.frag?raw'
import { bindUBO } from '../../../models/uniformBlock'

export type BlurDir = 'horizontal' | 'vertical'

export class BlurModel extends ScreenEffectModel {
  constructor(blurDir: BlurDir) {
    super(new Shader(vert, blurDir === 'horizontal' ? fragHori : fragVert))
    bindUBO(this.shader.program, 'Effect')
  }

  updateParams(params: BlurParams) {
    this.shader.use()
    this.shader.setUniformFloat('uBlurIntensity', params.blurLevel)
  }
}
