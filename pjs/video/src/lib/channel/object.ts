import { PixelChannelBase } from './channel'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { ImageResolution } from '../../media/pixels/types'
import { ImageScope } from '../../media/pixels/scope/scope'
import { PixelParser } from '../../media/pixels/parse'
import { GenericModel } from '../../gl/model/model'

export class ObjectRenderingChannel extends PixelChannelBase {

  protected readonly offscreenPass: OffScreenPass
  protected readonly parser: PixelParser
  protected readonly scope: ImageScope

  constructor(
    frameBufferResolution: ImageResolution,
    outputResolutionWidth: number
  ) {
    super()
    this.offscreenPass = new OffScreenPass(frameBufferResolution)
    this.scope = new ImageScope(frameBufferResolution, outputResolutionWidth)
    this.parser = new PixelParser(this.scope)
  }

  public models: GenericModel[] = []

  public override getPixels(): Uint8Array {
    const rawPixels = this.offscreenPass.renderAsPixels(this.models)
    return this.parser.parsePixelData(rawPixels)
  }

  public get bufferTex(): WebGLTexture {
    return this.offscreenPass.frameBuffer!.tex
  }
}
