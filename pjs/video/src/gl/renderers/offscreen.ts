import { FrameBuffer } from '../frameBuffer'
import { Renderer } from './renderer'
import { GenericModel } from '../model/model'
import { ScreenRect } from '../model/screen'
import { Texture } from '../texture'

export class OffScreenRenderer extends Renderer {
  protected frameBuffer: FrameBuffer

  constructor(
    protected frameBufferWidth: number,
    protected frameBufferHeight: number
  ) {
    super()
    this.frameBuffer = new FrameBuffer(frameBufferWidth, frameBufferHeight)
  }

  render(models: GenericModel[]) {
    this.frameBuffer.activate()
    super.render(models)
    this.frameBuffer.deactivate()
  }

  renderAsPixels(models: GenericModel[]) {
    this.frameBuffer.activate()
    super.render(models)
    const pixels = this.frameBuffer.readPixels()
    this.frameBuffer.deactivate()
    return pixels
  }
}

export class OffScreenTextureRenderer extends OffScreenRenderer {
  protected screenRect: ScreenRect

  constructor(frameBufferWidth: number, frameBufferHeight: number, readonly texture: Texture = new Texture()) {
    super(frameBufferWidth, frameBufferHeight)
    this.screenRect = new ScreenRect(texture)
  }

  render() {
    super.render([this.screenRect])
  }

  renderAsPixels(): Uint8Array {
    return super.renderAsPixels([this.screenRect])
  }

  setTextureImage(source: TexImageSource) {
    this.texture.setTextureImage(source)
  }
}
