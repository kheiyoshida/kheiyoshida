import { ScreenRect } from '../model/screen'
import { Texture } from '../texture'
import { GenericModel } from '../model/model'
import { RenderingPass } from './pass'
import { FrameBufferTextureRect } from '../../lib/effect/effect'
import screenVert from '../shaders/screen.vert?raw'
import screenFrag from '../shaders/screen.frag?raw'
import { Shader } from '../shader'

export class ScreenPass extends RenderingPass {
  public render(models: GenericModel[]) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    super.render(models)
  }
}

export class ScreenTexturePass extends ScreenPass {
  protected screenRect: ScreenRect

  constructor(
    readonly texture: Texture = new Texture()
  ) {
    super()
    this.screenRect = new ScreenRect(texture)
  }

  render() {
    super.render([this.screenRect])
  }

  setTextureImage(source: TexImageSource) {
    this.texture.setTextureImage(source)
  }
}

/**
 * render frame buffer texture to screen
 */
export class FrameBufferScreenPass extends ScreenPass {
  protected screenRect: FrameBufferTextureRect

  constructor(
    readonly frameBufferTex: WebGLTexture
  ) {
    super()
    this.screenRect = new FrameBufferTextureRect(frameBufferTex, new Shader(screenVert, screenFrag))
  }

  render() {
    super.render([this.screenRect])
  }

  setTextureImage(source: TexImageSource) {
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.frameBufferTex)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source)
  }
}
