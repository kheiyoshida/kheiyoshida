import { FrameBuffer } from '../frameBuffer'
import { RenderingPass } from './pass'
import { GenericModel } from '../model/model'
import { ScreenRect } from '../model/screen'
import { Texture } from '../texture'
import { ImageResolution } from '../../media/pixels/types'

export class OffScreenPass extends RenderingPass {
  public frameBuffer: FrameBuffer | undefined

  constructor(frameBufferOrResolution?: FrameBuffer | ImageResolution) {
    super()
    if (frameBufferOrResolution instanceof FrameBuffer) {
      this.frameBuffer = frameBufferOrResolution
    } else if (frameBufferOrResolution !== undefined ){
      this.frameBuffer = new FrameBuffer(frameBufferOrResolution.width, frameBufferOrResolution.height)
    }
  }

  validate() {
    if (this.frameBuffer === undefined) throw Error(`frameBuffer must be set`)
  }

  render(models: GenericModel[]) {
    this.frameBuffer!.activate()
    super.render(models)
    this.frameBuffer!.deactivate()
  }

  renderAsPixels(models: GenericModel[]) {
    this.frameBuffer!.activate()
    super.render(models)
    const pixels = this.frameBuffer!.readPixels()
    this.frameBuffer!.deactivate()
    return pixels
  }
}

export class OffScreenTexturePass extends OffScreenPass {
  protected screenRect: ScreenRect

  constructor(
    frameBufferResolution: ImageResolution,
    readonly sourceTexture: Texture = new Texture()
  ) {
    super(frameBufferResolution)
    this.screenRect = new ScreenRect(sourceTexture)
  }

  render() {
    super.render([this.screenRect])
  }

  renderAsPixels(): Uint8Array {
    return super.renderAsPixels([this.screenRect])
  }

  setTextureImage(source: TexImageSource) {
    this.sourceTexture.setTextureImage(source)
  }

  setReverseHorizontal(flag: boolean) {
    this.screenRect.setReverseHorizontal(flag)
  }
}
