import { Renderer } from './Renderer'

export class ScreenRenderer extends Renderer {
  protected texture!: WebGLTexture

  constructor(program: WebGLProgram) {
    super(program)
    this.setupScreenQuad()
  }

  protected quadVBO!: WebGLBuffer
  protected quadVAO!: WebGLVertexArrayObject

  private setupScreenQuad() {
    const gl = this.gl

    // Fullscreen quad (clip space -1 to +1)
    // video texture starts from top-left as (0,0),
    // while WebGL starts from bottom-left (-1, -1)
    const vertices = new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0])

    this.quadVBO = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVBO)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    this.quadVAO = gl.createVertexArray()!

    gl.bindVertexArray(this.quadVAO);

    const aPosition = gl.getAttribLocation(this.program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0)

    const aUV = gl.getAttribLocation(this.program, 'aUV')
    gl.enableVertexAttribArray(aUV)
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8) // 4bytes x2 for position

    gl.bindVertexArray(null);

    this.texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    const uTexture = gl.getUniformLocation(this.program, 'uTexture')
    gl.uniform1i(uTexture, 0) // texture unit 0
  }

  setTextureImage(source: TexImageSource) {
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source)
  }

  /**
   * draw screen rect with texture
   */
  draw() {
    this.use()
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.gl.bindVertexArray(this.quadVAO)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}

export class OffscreenRenderer extends ScreenRenderer {
  private offscreenTexture!: WebGLTexture
  private frameBuffer!: WebGLFramebuffer

  constructor(
    program: WebGLProgram,
    private width = 400,
    private height = 300
  ) {
    super(program)
    this.setupFrameBuffer()
  }

  private setupFrameBuffer() {
    // create frame buffer
    this.frameBuffer = this.gl.createFramebuffer()!
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer)

    // offscreen texture
    this.offscreenTexture = this.gl.createTexture()!
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.offscreenTexture)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0, // level
      this.gl.RGBA, // internalFormat
      this.width,
      this.height,
      0, // border
      this.gl.RGBA, // format
      this.gl.UNSIGNED_BYTE, // type
      null // no data, just allocate
    )

    const gl = this.gl
    // required texture parameters for framebuffer completeness
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // attach it to framebuffer
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.offscreenTexture,
      0 // mipmap level
    )

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      if (status === this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
        throw Error('Framebuffer incomplete: Attachment is missing or invalid')
      } else if (status === this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
        throw Error('Framebuffer incomplete: No attachments')
      } else if (status === this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
        throw Error('Framebuffer incomplete: Attachments have different dimensions')
      } else if (status === this.gl.FRAMEBUFFER_UNSUPPORTED) {
        throw Error('Framebuffer incomplete: Unsupported configuration')
      } else {
        throw Error(`Framebuffer incomplete: Unknown error ${status.toString(16)}`)
      }
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  drawToOffscreenBuffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer)
    this.draw()

    const pixelBuffer = this.readPixels()

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)

    return pixelBuffer
  }

  private readPixels() {
    const pixelBuffer = new Uint8Array(this.width * this.height * 4)

    this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixelBuffer)

    return pixelBuffer
  }
}
