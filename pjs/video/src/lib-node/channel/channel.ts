import { Drawable, ScreenRect, Texture } from 'graph-gl'
import { VideoSupply } from '../../media/video/supply'
import { VideoSource } from '../../lib/source/source'
import { getGL } from '../../gl/gl'

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
  private readonly texture: Texture = new Texture()

  constructor(readonly source: VS) {
    super()
    this.screenRect = new ScreenRect()
    this.screenRect.tex = this.texture.tex
    this.drawObjects = [this.screenRect]
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
  constructor(source: VideoSupply) {
    super(source)
  }

  private isLoading = true;

  override get isAvailable() {
    return !this.isLoading
  }

  public async waitForReady(onProgress: (progress: number) => void) {
    const interval = setInterval(() => {
      onProgress(this.source.loadingProgress)
    }, 100)
    await this.source.readyPromise
    this.isLoading = false
    clearTimeout(interval)
  }
}
