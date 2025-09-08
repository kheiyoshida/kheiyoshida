import { Channel } from '../../lib/channel/channel'
import { VideoSource } from '../../lib/source/source'
import { loadVideoSourceList, waitForVideosToLoad } from '../../media/video/load'
import { cdnVideoSourceList, videoSourceList } from './videos'
import { makeVideoSupply, SupplyVideoOption, VideoSupply } from '../../media/video/supply'
import { Texture } from '../../gl/texture'
import { OffScreenTextureRenderer } from '../../gl/renderers/offscreen'
import { ImageScope } from '../../media/pixels/scope/scope'
import { PixelParser } from '../../media/pixels/parse'
import { fireByRate, makeIntWobbler, randomIntInclusiveBetween, randomItemFromArray } from 'utils'

export class ShinjukuFootageCollection implements VideoSource {
  private readonly videoElements: HTMLVideoElement[]
  private readonly videoSupply: VideoSupply

  constructor() {
    this.videoElements = loadVideoSourceList(videoSourceList)
    this.videoSupply = makeVideoSupply(this.videoElements, { speed: 0.3 })
    this.videoSupply.onEnded(() => this.videoSupply.swapVideo())
  }

  get currentVideo(): HTMLVideoElement {
    return this.videoSupply.currentVideo
  }

  public waitForVideosToLoad(onProgress: (progress: number) => void, secs = 30) {
    return waitForVideosToLoad(this.videoElements, onProgress, secs, 'canplaythrough')
  }

  public swapVideo() {
    this.videoSupply.swapVideo()
  }

  onEnded(cb: () => void): void {
    this.videoSupply.onEnded(cb)
  }

  onSwap(cb: (video: HTMLVideoElement) => void): void {
    this.videoSupply.onSwap(cb)
  }

  updateOptions(newOptions: SupplyVideoOption): void {
    this.videoSupply.updateOptions(newOptions)
  }
}

export class ShinjukuChannel extends Channel<ShinjukuFootageCollection> {
  private readonly videoTexture: Texture
  private readonly offscreenTextureRenderer: OffScreenTextureRenderer
  private readonly parser: PixelParser
  public readonly scope: ImageScope

  constructor(
    source: ShinjukuFootageCollection,
    frameBufferWidth: number,
    frameBufferHeight: number,
    finalResolutionWidth: number,
  ) {
    super(source)

    // texture
    this.videoTexture = new Texture()
    this.offscreenTextureRenderer = new OffScreenTextureRenderer(
      this.videoTexture,
      frameBufferWidth,
      frameBufferHeight
    )

    // parser
    this.scope = new ImageScope(
      {
        width: frameBufferWidth,
        height: frameBufferHeight,
      },
      finalResolutionWidth
    )
    this.parser = new PixelParser(this.scope)
  }

  public getPixels(): Uint8Array {
    this.videoTexture.setTextureImage(this.source.currentVideo)
    const rawPixels = this.offscreenTextureRenderer.renderAsPixels()
    return this.parser.parsePixelData(rawPixels)
  }

  public get finalResolution() {
    return this.scope.finalResolution
  }

  // use cases

  private wobble = makeIntWobbler(10)
  public update() {
    if (fireByRate(0.05)) {
      this.source.swapVideo()
    }
    if (fireByRate(0.4)) {
      this.source.updateOptions({
        speed: randomItemFromArray([0.1, 0.3, 0.5]),
      })
    }
    if (fireByRate(0.1)) {
      this.scope.magnifyLevel = randomIntInclusiveBetween(0, this.scope.maxMagnifyLevel)
    }
    if (fireByRate(0.3)) {
      this.scope.position = {
        x: this.wobble(this.scope.position.x),
        y: this.wobble(this.scope.position.y),
      }
    }
  }

  public interact(e: PointerEvent) {
    const offsetX = e.x - window.innerWidth / 2
    const offsetY = e.y - window.innerHeight / 2
    if (this.scope.magnifyLevel == this.scope.maxMagnifyLevel) {
      this.source.swapVideo()
      this.scope.magnifyLevel = 0
    } else {
      this.scope.magnifyLevel++
      this.scope.position = {
        x: this.scope.position.x + Math.floor(10 * (offsetX / window.innerWidth)),
        y: this.scope.position.y + Math.floor(10 * (offsetY / window.innerHeight)),
      }
    }
  }
}
