import { Drawable, getGL, ScreenRect, Shader, Texture } from 'graph-gl'
import { VideoSupply } from '../../media/video/supply'
import { VideoSource } from '../../lib/source/source'

export abstract class Channel implements Drawable {
  protected abstract drawObjects: Drawable[]

  draw(): void {
    this.drawObjects.forEach((model) => model.draw())
  }

  public get isAvailable(): boolean {
    return true
  }
}

export class TextureChannel<VS extends VideoSource = VideoSource> extends Channel {
  protected drawObjects: Drawable[]
  public readonly screenRect: ScreenRect
  protected readonly texture: Texture = new Texture()

  constructor(
    readonly source: VS,
    screenRectShader?: Shader
  ) {
    super()
    this.screenRect = new ScreenRect(screenRectShader)
    this.screenRect.tex = this.texture.tex
    this.drawObjects = [this.screenRect]
    this.texture.yFlip = true
  }

  get gl() {
    return getGL()
  }

  override draw(): void {
    this.texture.setTextureImage(this.source.currentVideo)
    super.draw()
  }
}

export class VideoChannel extends TextureChannel<VideoSupply> {
  constructor(source: VideoSupply | string[]) {
    super(source instanceof VideoSupply ? source : new VideoSupply(source))
  }

  private isLoading = true

  override get isAvailable() {
    return !this.isLoading
  }

  public async waitForReady(onProgress?: (progress: number) => void) {
    const interval = setInterval(() => {
      onProgress?.(this.source.loadingProgress)
    }, 100)
    await this.source.readyPromise
    this.isLoading = false
    clearTimeout(interval)
  }
}
