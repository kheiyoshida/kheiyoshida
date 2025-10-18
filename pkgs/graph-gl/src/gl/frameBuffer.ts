import { getGL } from './gl'

export class FrameBuffer {
  public fbo: WebGLFramebuffer

  public pixels: Uint8Array

  public readonly tex: WebGLTexture

  constructor(
    readonly width: number,
    readonly height: number
  ) {
    const gl = getGL()
    this.tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

    // to make loop
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    this.fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, 0)
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

    // Ensure subsequent readPixels reads from this FBO's color attachment
    gl.readBuffer(gl.COLOR_ATTACHMENT0);
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
    // Make sure the read buffer is the color attachment we rendered to
    gl.readBuffer(gl.COLOR_ATTACHMENT0);
    gl.finish()
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    return this.pixels
  }
}

export class NewFrameBuffer {
  private readonly fbo: WebGLFramebuffer;
  public readonly tex: WebGLTexture;
  public readonly pixels: Uint8Array;

  // port working implementation here
  constructor(readonly width: number, readonly height: number) {
    const gl = getGL()

    // create color texture attachment
    this.tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // create framebuffer
    this.fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, 0)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if (status !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Framebuffer incomplete')

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // CPU-side pixel buffer
    this.pixels = new Uint8Array(width * height * 4)
  }

  /** Bind this framebuffer for rendering */
  activate(clear = true): void {
    const gl = getGL()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.viewport(0, 0, this.width, this.height)
    gl.readBuffer(gl.COLOR_ATTACHMENT0)
    if (clear) {
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }


  /** Unbind the framebuffer and return to screen rendering */
  deactivate(): void {
    const gl = getGL();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** Read pixel data (RGBA Uint8Array) from this framebuffer */
  readPixels(): Uint8Array {
    const gl = getGL();

    // Make sure correct buffer is selected
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.readBuffer(gl.COLOR_ATTACHMENT0);

    // Ensure GPU finished writing
    gl.finish();

    gl.readPixels(
      0,
      0,
      this.width,
      this.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.pixels
    );

    return this.pixels;
  }

  /** Delete all GL resources */
  dispose(): void {
    const gl = getGL();
    gl.deleteFramebuffer(this.fbo);
    gl.deleteTexture(this.tex);
  }
}
