import { getGL } from './gl'

export class Texture {
  public readonly tex: WebGLTexture
  constructor() {
    const gl = getGL()
    this.tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }

  /**
   * use this id to set texture uniform
   * ```ts
   * const uTexture = gl.getUniformLocation(this.program, 'uTexture')
   * gl.uniform1i(uTexture, texture.unit)
   * ```
   */
  readonly unit: number = 0

  get gl() {
    return getGL()
  }

  public setTextureImage(source: TexImageSource) {
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source)
  }
}
