import { GenericModel } from './model'
import { Shader } from '../shader'
import screenVert from '../shaders/screen.vert?raw'
import screenFrag from '../shaders/screen.frag?raw'
import { Texture } from '../texture'
import { getGL } from '../gl'

export class Texture2dModel extends GenericModel {
  constructor(
    private readonly tex: WebGLTexture,
    screenShader: Shader,
    dataArray: Float32Array
  ) {
    super(screenShader, dataArray, [
      { name: 'aPos', size: 2, stride: 16, offset: 0 },
      { name: 'aUV', size: 2, stride: 16, offset: 8 },
    ])

    this.shader.use()
    this.shader.setUniformInt('uTexture', 0) // always use color unit
  }

  override draw() {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    super.draw(getGL().TRIANGLE_STRIP)
  }
}

/**
 * screen rect that renders texture input
 */
export class ScreenRect extends Texture2dModel {
  constructor(texture: Texture, screenShader = new Shader(screenVert, screenFrag)) {
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 1,
      1, -1, 1, 1,
      -1, 1, 0, 0,
      1, 1, 1, 0
    ])
    super(texture.tex, screenShader, screenRectVertices)
  }
}
