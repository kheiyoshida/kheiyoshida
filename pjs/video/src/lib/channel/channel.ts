import { VideoSource } from '../source/source'
import { OffScreenTextureRenderer } from '../../gl/renderers/offscreen'
import { PixelParser } from '../../media/pixels/parse'
import { ImageScope } from '../../media/pixels/scope/scope'
import { ImageResolution } from '../../media/pixels/types'
import { VideoSupply } from '../../media/video/supply'

/**
 * abstracts operations below:
 * - preparing offscreen renderer
 * - render video onto offscreen buffer
 * - read pixel data from the buffer
 * - set parameters for read operation
 */
export abstract class PixelChannel<VS extends VideoSource = VideoSource> {
  protected readonly offscreenTextureRenderer: OffScreenTextureRenderer
  protected readonly parser: PixelParser
  public readonly scope: ImageScope

  protected constructor(
    readonly source: VS,
    frameBufferResolution: ImageResolution,
    outputResolutionWidth: number
  ) {
    this.offscreenTextureRenderer = new OffScreenTextureRenderer(frameBufferResolution)
    this.scope = new ImageScope(frameBufferResolution, outputResolutionWidth)
    this.parser = new PixelParser(this.scope)
  }

  public get outputResolution() {
    return this.scope.finalResolution
  }

  public getPixels(): Uint8Array {
    this.offscreenTextureRenderer.setTextureImage(this.source.currentVideo)
    const rawPixels = this.offscreenTextureRenderer.renderAsPixels()
    return this.parser.parsePixelData(rawPixels)
  }
}

export class VideoPixelChannel extends PixelChannel<VideoSupply> {
  constructor(
    source: VideoSupply,
    videoResolution: ImageResolution,
    outputResolutionWidth: number
  ) {
    super(source, videoResolution, outputResolutionWidth)
  }

  public async waitForReady(onProgress: (progress: number) => void) {
    const interval = setInterval(() => {
      onProgress(this.source.loadingProgress)
    }, 100)
    await this.source.readyPromise
    clearTimeout(interval)
  }
}
