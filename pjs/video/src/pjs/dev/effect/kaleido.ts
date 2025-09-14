import { PostEffect, PostScreenEffect } from '../../../lib/effect/effect'
import { Shader } from '../../../gl/shader'
import vert from './kaleido.vert?raw'
import frag from './kaleido.frag?raw'
import { Texture2dModel } from '../../../gl/model/screen'

export class KaleidoscopeRect extends Texture2dModel {
  constructor(tex: WebGLTexture, shader: Shader) {

    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, 1,  1, 0,
      -1, -1, 0, 0,
      1,  1,  1, 1,
      1,  -1,  1, 0
    ])

    super(tex, shader, screenRectVertices)
  }
}

export class KaleidoscopeEffect extends PostEffect {
  constructor(tex: WebGLTexture) {
    const shader = new Shader(vert, frag)
    super(tex)
    this.models.push(new KaleidoscopeRect(tex, shader))
  }
}
