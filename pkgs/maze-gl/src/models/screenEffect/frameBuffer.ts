/* eslint-disable no-console */
import { Shader } from '../index'
import { ColorTexture, DepthTexture, NormalTexture } from './texture'

export abstract class FrameBuffer {
  private readonly framebuffer: WebGLFramebuffer

  protected constructor(protected gl: WebGL2RenderingContext) {
    const buffer = gl.createFramebuffer()
    if (!buffer) throw Error(`failed to create frame buffer`)

    this.framebuffer = buffer
  }

  initialize(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    this.initFrameBuffer()

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

  abstract initFrameBuffer(): void

  /**
   * start drawing to the offscreen frame buffer
   * the drawn buffer can be drawn to screen by calling drawOffscreenFrame()
   */
  startDrawToBuffer(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
  }

  /**
   * end drawing to the offscreen frame buffer.
   */
  endDrawToBuffer(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  /**
   * activate the drawn offscreen (textures) and draw it to actual screen
   */
  abstract drawOffscreenFrame(screenShader: Shader, drawScreen: () => void): void
}

/**
 * frame buffer that stores normal, color, and depth
 */
export class NormalColorDepthFrameBuffer extends FrameBuffer {
  constructor(
    gl: WebGL2RenderingContext,
    private normalTexture: NormalTexture,
    private colorTexture: ColorTexture,
    private depthTexture: DepthTexture
  ) {
    super(gl)
  }

  initFrameBuffer(): void {
    const gl = this.gl
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture.tex, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.normalTexture.tex, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture.tex, 0)

    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]) // Color, Normal
  }

  drawOffscreenFrame(screenShader: Shader, drawScreen: () => void): void {
    this.colorTexture.activate()
    screenShader.setUniformInt('ColorTexture', this.colorTexture.unit)

    this.normalTexture.activate()
    screenShader.setUniformInt('NormalTexture', this.normalTexture.unit)

    this.depthTexture.activate()
    screenShader.setUniformInt('DepthTexture', this.depthTexture.unit)

    drawScreen()
  }
}
