import { GenericModel } from './model'
import { Shader } from '../shader'
import screenVert from '../shaders/screen.vert?raw'
import screenFrag from '../shaders/screen.frag?raw'
import screenFrag2 from '../shaders/screen2.frag?raw'
import { Texture } from '../texture'
import { getGL } from '../gl'
import { FrameBuffer } from '../frameBuffer'

/**
 * screen rect that renders texture input
 */
export class ScreenRect extends GenericModel {
  constructor(readonly texture: Texture) {
    const screenShader = new Shader(screenVert, screenFrag)
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 1,
      1, -1, 1, 1,
      -1, 1, 0, 0,
      1, 1, 1, 0
    ])
    super(screenShader, screenRectVertices, [
      { name: 'aPos', size: 2, stride: 16, offset: 0 },
      { name: 'aUV', size: 2, stride: 16, offset: 8 },
    ])

    this.setTexture()
  }

  public setTexture() {
    this.shader.use()
    this.shader.setUniformInt('uTexture', 0) // always use color unit
  }

  override draw() {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.texture.tex)
    super.draw(getGL().TRIANGLE_STRIP)
  }
}

/**
 * screen rect that renders texture input
 */
export class ScreenRect2 extends GenericModel {
  private tex: WebGLTexture

  constructor(frameBuffer: FrameBuffer) {
    const screenShader = new Shader(screenVert, screenFrag2)
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 0,
      1, -1,  1, 0,
      -1, 1,  0, 1,
      1, 1,   1, 1
    ])
    super(screenShader, screenRectVertices, [
      { name: 'aPos', size: 2, stride: 16, offset: 0 },
      { name: 'aUV', size: 2, stride: 16, offset: 8 },
    ])

    this.tex = frameBuffer.tex
    this.setTexture()
  }

  public setTexture() {
    this.shader.use()
    this.shader.setUniformInt('uTexture', 0) // always use color unit
  }

  override draw() {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.tex)

    super.draw(gl.TRIANGLE_STRIP)
  }
}
