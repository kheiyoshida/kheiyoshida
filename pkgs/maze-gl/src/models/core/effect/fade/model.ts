import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './fade.frag?raw'
import { bindUBO } from '../../../supporting/uniformBlock'
import { Shader } from 'graph-gl'

export type FadeParams = {
  fadeLevel: number
}

export class FadeEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
    bindUBO(this.shader.program, 'Color')
  }

  updateParams(params: FadeParams) {
    this.shader.use()
    this.shader.setUniformFloat('uFadeoutPercentage', params.fadeLevel)
  }
}
