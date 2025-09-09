import { VideoSource } from '../source/source'
import { OffScreenTexturePass } from '../../gl/pass/offscreen'
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
  protected readonly offscreenTextureRenderer: OffScreenTexturePass
  protected readonly parser: PixelParser
  public readonly scope: ImageScope

  protected constructor(
    readonly source: VS,
    frameBufferResolution: ImageResolution,
    outputResolutionWidth: number
  ) {
    this.offscreenTextureRenderer = new OffScreenTexturePass(frameBufferResolution)
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

  public iteratePixelData(iterator: (i: number) => void) {
    const readHeight = this.outputResolution.height
    const readWidth = this.outputResolution.width
    for (let y = 0; y < readHeight; y += 1) {
      for (let x = 0; x < readWidth; x += 1) {
        // TODO: translate the actual position of pixel fragment by converting x & y into pixel data compatible
        const i = (y * this.outputResolution.width + x) * 4
        iterator(i)
      }
    }
  }
}

export class VideoPixelChannel extends PixelChannel<VideoSupply> {
  constructor(
    source: VideoSupply,
    videoAspectRatio: number,
    videoWidth: number,
    outputResolutionWidth: number
  ) {
    const videoResolution: ImageResolution = {
      width: videoWidth,
      height: videoWidth / videoAspectRatio
    }
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
