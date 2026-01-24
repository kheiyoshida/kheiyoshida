import { ScreenEffectModel } from '../model'
import { Shader } from 'graph-gl'
import vert from '../shared/screen.vert?raw'
import fragVert from './blurVert.frag?raw'
import fragHori from './blurHori.frag?raw'
import { bindUBO } from '../../../supporting/uniformBlock'

export type BlurDir = 'horizontal' | 'vertical'

export type BlurParams = {
  blurLevel: number
}

export class BlurEffect extends ScreenEffectModel {
  constructor(blurDir: BlurDir) {
    super(new Shader(vert, blurDir === 'horizontal' ? fragHori : fragVert))
    bindUBO(this.shader.program, 'Effect')
  }

  updateParams(params: BlurParams) {
    this.shader.use()
    this.shader.setUniformFloat('uBlurIntensity', params.blurLevel)
  }
}
