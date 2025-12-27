import { FrameBuffer, GenericModel, getGL, Shader, TextureUnit } from 'graph-gl'

export class ScreenEffectModel extends GenericModel {
  public colorTexture: WebGLTexture | undefined
  public normalTexture: WebGLTexture | undefined
  public depthTexture: WebGLTexture | undefined

  constructor(screenShader: Shader) {
    // prettier-ignore
    const dataArray = new Float32Array([
      -1, -1, 0, 0,
      1, -1,  1, 0,
      -1, 1,  0, 1,
      1, 1,   1, 1
    ])

    super(screenShader, dataArray, [
      { name: 'aPos', size: 2, stride: 16, offset: 0 },
      { name: 'aUV', size: 2, stride: 16, offset: 8 },
    ])

    this.shader.use()
    this.shader.setUniformInt('uColorTexture', TextureUnit.Color)
    this.shader.setUniformInt('uNormalTexture', TextureUnit.Normal)
    this.shader.setUniformInt('uDepthTexture', TextureUnit.Depth)
  }

  validate() {
    if (!this.colorTexture) throw new Error(`texture is not set for ${this.constructor.name}`)
  }

  override draw() {
    const gl = getGL()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture!)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.normalTexture!)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture!)

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

  public setInput(inputFrameBuffer: FrameBuffer, sceneFrameBuffer: FrameBuffer): void {
    this.colorTexture = inputFrameBuffer.colorTexture.tex
    this.normalTexture = inputFrameBuffer.normalTexture?.tex
    this.depthTexture = sceneFrameBuffer.depthTexture?.tex
  }

  public enabled = true
}
