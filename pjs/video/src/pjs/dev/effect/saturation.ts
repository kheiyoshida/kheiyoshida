import { PostScreenEffect } from '../../../lib/effect/effect'
import vert from './saturation.vert?raw'
import frag from './saturation.frag?raw'
import { Shader } from '../../../gl/shader'

export class SaturationEffect extends PostScreenEffect {
  constructor(tex: WebGLTexture) {
    super(tex, new Shader(vert, frag))
  }
}
