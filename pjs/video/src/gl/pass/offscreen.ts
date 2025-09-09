import { FrameBuffer } from '../frameBuffer'
import { RenderingPass } from './pass'
import { GenericModel } from '../model/model'
import { ScreenRect } from '../model/screen'
import { Texture } from '../texture'
import { ImageResolution } from '../../media/pixels/types'

export class OffScreenPass extends RenderingPass {
  protected frameBuffer: FrameBuffer

  constructor(
    protected frameBufferResolution: ImageResolution,
  ) {
    super()
    this.frameBuffer = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)
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

export class OffScreenTexturePass extends OffScreenPass {
  protected screenRect: ScreenRect

  constructor(frameBufferResolution: ImageResolution,readonly texture: Texture = new Texture()) {
    super(frameBufferResolution)
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
