import { VideoSource } from '../source/source'
import { OffScreenTexturePass } from '../../gl/pass/offscreen'
import { PixelParser } from '../../media/pixels/parse'
import { ImageScope } from '../../media/pixels/scope/scope'
import { ImageResolution } from '../../media/pixels/types'
import { VideoSupply } from '../../media/video/supply'
import { ScreenTexturePass } from '../../gl/pass/onscreen'

export abstract class PixelChannelBase {
  public abstract getPixels(): Uint8Array

  public get isAvailable(): boolean {
    return true
  }

  public abstract get bufferTex(): WebGLTexture
}

/**
 * abstracts operations below:
 * - preparing offscreen renderer
 * - render video onto offscreen buffer
 * - read pixel data from the buffer
 * - set parameters for read operation
 */
export abstract class PixelChannel<VS extends VideoSource = VideoSource> extends PixelChannelBase {
  protected readonly offScreenTexturePass: OffScreenTexturePass
  protected readonly parser: PixelParser
  protected readonly scope: ImageScope

  protected constructor(
    readonly source: VS,
    frameBufferResolution: ImageResolution,
    outputResolutionWidth: number
  ) {
    super()
    this.offScreenTexturePass = new OffScreenTexturePass(frameBufferResolution)
    this.scope = new ImageScope(frameBufferResolution, outputResolutionWidth)
    this.parser = new PixelParser(this.scope)
  }

  public get outputResolution() {
    return this.scope.finalResolution
  }

  public getPixels(): Uint8Array {
    this.offScreenTexturePass.setTextureImage(this.source.currentVideo)
    const rawPixels = this.offScreenTexturePass.renderAsPixels()
    return this.parser.parsePixelData(rawPixels)
  }

  public get bufferTex() {
    return this.offScreenTexturePass.frameBuffer.tex
  }

  public setReverseHorizontal(flag: boolean) {
    this.offScreenTexturePass.setReverseHorizontal(flag)
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
      height: videoWidth / videoAspectRatio,
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

// renders videos directly onto screen
export class DebugChannel<VS extends VideoSource = VideoSource> {
  protected readonly screenTexturePass: ScreenTexturePass

  protected constructor(readonly source: VS) {
    this.screenTexturePass = new ScreenTexturePass()
  }

  public render(): void {
    this.screenTexturePass.setTextureImage(this.source.currentVideo)
    this.screenTexturePass.render()
  }
}

export class DebugVideoChannel extends DebugChannel<VideoSupply> {
  public async waitForReady(onProgress: (progress: number) => void) {
    const interval = setInterval(() => {
      onProgress(this.source.loadingProgress)
    }, 100)
    await this.source.readyPromise
    clearTimeout(interval)
  }
}
