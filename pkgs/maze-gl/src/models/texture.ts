export abstract class Texture {
  static globalTextureNumber: number | null = null

  protected gl: WebGL2RenderingContext
  tex: WebGLTexture
  width: number
  height: number

  readonly unit: number

  protected constructor(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    internalFormat: number,
    format: number,
    type: number,
    params: [pname: number, param: number][]
  ) {
    this.gl = gl

    const id = gl.createTexture()
    if (!id) {
      throw Error(`failed to create texture`)
    }

    this.tex = id
    this.width = width
    this.height = height

    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null)
    params.forEach(([pname, param]) => gl.texParameteri(gl.TEXTURE_2D, pname, param))
    gl.bindTexture(gl.TEXTURE_2D, null)

    if (Texture.globalTextureNumber === null) {
      Texture.globalTextureNumber = 0
    } else {
      Texture.globalTextureNumber++
    }
    this.unit = Texture.globalTextureNumber
  }

  /**
   * make the texture active.
   * remember to call shader.setInt('TextureUniform', unit) after this call
   */
  activate(): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + this.unit)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex)
  }

  deactivate(): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }
}
