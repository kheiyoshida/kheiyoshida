import { ScreenEffectModel } from '../model'
import { Shader } from '../../../models'
import vert from '../shared/screen.vert?raw'
import frag from './fog.frag?raw'
import { bindUBO } from '../../../models/uniformBlock'

export class FogEffect extends ScreenEffectModel {
  constructor() {
    const shader = new Shader(vert, frag)
    super(shader)

    bindUBO(shader.program, 'Color')
  }
}
