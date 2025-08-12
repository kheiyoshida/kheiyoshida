import { getGL } from './gl'

/**
 * frame buffer to draw colors into, not more than that
 */
export class FrameBuffer {
  public fbo: WebGLFramebuffer

  public pixels: Uint8Array

  constructor(
    readonly width: number,
    readonly height: number
  ) {
    const gl = getGL()
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    this.fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    this.pixels = new Uint8Array(width * height * 4) // 4 values per rgba
  }

  /**
   * start drawing into frame buffer
   */
  public activate() {
    const gl = getGL()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.viewport(0, 0, this.width, this.height)
  }

  /**
   * stop drawing into frame buffer and start drawing subsequent stuff to screen
   */
  public deactivate() {
    const gl = getGL()
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  public readPixels(): Uint8Array {
    const gl = getGL()
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    return this.pixels
  }
}
