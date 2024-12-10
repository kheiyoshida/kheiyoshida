import { Texture } from '../../models/texture'
import { Shader } from '../../models'

export class FrameBuffer {
  private readonly framebuffer: WebGLFramebuffer

  constructor(
    private gl: WebGL2RenderingContext,
    readonly normalTexture: Texture,
    readonly depthTexture: Texture
  ) {
    const buffer = gl.createFramebuffer()
    if (!buffer) throw Error(`failed to create frame buffer`)

    this.framebuffer = buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, normalTexture.id, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture.id, 0)

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Framebuffer not complete')
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

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

  drawOffscreenFrame(screenShader: Shader, drawScreen: () => void): void {
    // Pass the depthTexture unit to the shader
    this.depthTexture.activate()
    screenShader.setInt('DepthTexture', 0)

    this.normalTexture.activate()
    screenShader.setInt('ColorTexture', 1)

    drawScreen()
  }
}

