import { GenericModel } from '../model'
import { Shader } from '../../gl/shader'
import screenVert from './screen.vert?raw'
import screenFrag from './screen.frag?raw'
import { getGL } from '../../gl/gl'

export class Texture2dModel extends GenericModel {
  public tex: WebGLTexture | undefined

  constructor(screenShader: Shader, dataArray: Float32Array, tex?: WebGLTexture) {
    super(screenShader, dataArray, [
      { name: 'aPos', size: 2, stride: 16, offset: 0 },
      { name: 'aUV', size: 2, stride: 16, offset: 8 },
    ])

    this.tex = tex

    this.shader.use()
    this.shader.setUniformInt('uTexture', 0) // always use color unit
  }

  validate() {
    if (!this.tex) throw new Error(`texture is not set for ${this.constructor.name}`)
  }

  override draw() {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.tex!)
    super.draw(getGL().TRIANGLE_STRIP)
  }

  public setReverseHorizontal(bool: boolean) {
    this.shader.use()
    this.shader.setUniformInt('uReverseHorizontal', bool ? 1 : 0)
  }

  public setReverseVertical(bool: boolean) {
    this.shader.use()
    this.shader.setUniformInt('uReverseVertical', bool ? 1 : 0)
  }
}

/**
 * screen rect that renders texture input
 */
export class ScreenRect extends Texture2dModel {
  constructor(screenShader = new Shader(screenVert, screenFrag)) {
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 1,
      1, -1, 1, 1,
      -1, 1, 0, 0,
      1, 1, 1, 0
    ])
    super(screenShader, screenRectVertices)
  }
}
