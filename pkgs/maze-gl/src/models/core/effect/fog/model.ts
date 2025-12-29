import { ScreenEffectModel } from '../model'
import vert from '../shared/screen.vert?raw'
import frag from './fog.frag?raw'
import { bindUBO } from '../../../supporting/uniformBlock'
import { Shader } from 'graph-gl'

export type FogParams = {
  fogLevel: number
}

export class FogEffect extends ScreenEffectModel {
  constructor() {
    const shader = new Shader(vert, frag)
    super(shader)

    bindUBO(shader.program, 'Color')
  }

  updateParams(params: FogParams) {
    // todo: implement
  }
}
