import { getGL } from './gl'
import {
  FrameBufferColorTexture,
  FrameBufferDepthTexture,
  FrameBufferNormalTexture,
  FrameBufferTextureParams,
} from './texture'
import { ImageResolution } from '../graph'

export type FrameBufferCapabilities = {
  normal?: boolean | FrameBufferTextureParams
  depth?: boolean | FrameBufferTextureParams
}

export class FrameBuffer {
  public fbo: WebGLFramebuffer

  public pixels: Uint8Array

  /**
   * @deprecated use `colorTexture` instead.
   */
  public get tex(): WebGLTexture {
    return this.colorTexture.tex
  }

  public readonly colorTexture: FrameBufferColorTexture
  public readonly normalTexture?: FrameBufferNormalTexture
  public readonly depthTexture?: FrameBufferDepthTexture

  constructor(
    readonly width: number,
    readonly height: number,
    capabilities: FrameBufferCapabilities = {}
  ) {
    const gl = getGL()
    const size = { width, height }

    // set up texture
    this.colorTexture = new FrameBufferColorTexture({
      repeat: true,
      size,
    })

    if (capabilities.normal) {
      const params = capabilities.normal === true ? { size } : { ...capabilities.normal, size }
      this.normalTexture = new FrameBufferNormalTexture(params)
    }

    if (capabilities.depth) {
      const params = capabilities.depth === true ? { size } : { ...capabilities.depth, size }
      this.depthTexture = new FrameBufferDepthTexture(params)
    }

    // bind fbo
    this.fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture.tex, 0)
    if (this.normalTexture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture.tex, 0)
    }
    if (this.depthTexture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture.tex, 0)
    }

    gl.drawBuffers(this.normalTexture ? [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1] : [gl.COLOR_ATTACHMENT0])

    this.validateFrameBufferStatus()

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // prepare pixel array
    this.pixels = new Uint8Array(width * height * 4) // 4 values per rgba
  }

  private gl = getGL()

  private validateFrameBufferStatus() {
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
  }

  /**
   * start drawing into the frame buffer
   */
  public activate() {
    const gl = getGL()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.viewport(0, 0, this.width, this.height)

    // Ensure subsequent readPixels reads from the FBO's color attachment
    gl.readBuffer(gl.COLOR_ATTACHMENT0)
  }

  /**
   * stop drawing into the frame buffer
   * and start drawing the following stuff onto the screen
   */
  public deactivate() {
    const gl = getGL()
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  public readPixels(): Uint8Array {
    const gl = getGL()
    // Make sure the read buffer is the color attachment we rendered to
    gl.readBuffer(gl.COLOR_ATTACHMENT0)
    gl.finish()
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    return this.pixels
  }
}

/**
 * frame buffer with color, normal and depth texture attached
 */
export class FullFrameBuffer extends FrameBuffer {
  public readonly normalTexture!: FrameBufferNormalTexture
  public readonly depthTexture!: FrameBufferDepthTexture

  constructor(
    width: number,
    height: number,
    capabilities: Required<FrameBufferCapabilities> = { depth: true, normal: true }
  ) {
    super(width, height, capabilities)
  }
}
