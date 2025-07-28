import { Renderer } from './Renderer'

export class ScreenRenderer extends Renderer {
  private texture!: WebGLTexture

  constructor(program: WebGLProgram) {
    super(program)
    this.setupScreenRect()
  }

  private setupScreenRect() {
    const gl = this.gl

    // Fullscreen quad (clip space -1 to +1)
    // video texture starts from top-left as (0,0), while WebGL starts from bottom-left (-1, -1)
    const vertices = new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(this.program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0)

    const aUV = gl.getAttribLocation(this.program, 'aUV')
    gl.enableVertexAttribArray(aUV)
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8) // 4bytes x2 for position

    this.texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    const uTexture = gl.getUniformLocation(this.program, 'uTexture')
    gl.uniform1i(uTexture, 0) // texture unit 0
  }

  setTextureImage(source: TexImageSource) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source)
  }

  /**
   * draw screen rect with texture
   */
  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}
