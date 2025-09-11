import { PixelChannel } from './channel/channel'
import { PixelPresentation } from './presentation'
import { OffScreenPass } from '../gl/pass/offscreen'
import { PostEffect } from './effect/effect'

export class VideoProjectionPipeline {
  constructor(
    private readonly channels: PixelChannel[],
    private readonly presentations: PixelPresentation[]
  ) {
    this.presentationPass = new OffScreenPass({ width: 960, height: 540 })
  }

  private presentationPass: OffScreenPass
  private readonly postEffects: PostEffect[] = []

  public registerEffect(factory: (tex: WebGLTexture) => PostEffect) {
    this.postEffects.push(factory(this.presentationPass.frameBuffer.tex))
  }

  public setBackgroundColor(rgba: [number, number, number, number]): void {
    this.presentationPass.backgroundColor = rgba
  }

  private channelIndex = 0
  public get currentChannel() {
    return this.channels[this.channelIndex]
  }

  public render() {
    const pixels = this.currentChannel.getPixels()
    const presentations = this.presentations // TODO: maybe filter by on/off
    for (const presentation of presentations) {
      presentation.represent(pixels)
    }
    this.presentationPass.render(presentations.map((p) => p.instance))

    if (this.postEffects.length > 0) {
      this.postEffects[0].render() // TODO: implement multi effect
    }
  }
}

export function startRenderingLoop(render: (frameCount: number) => void, targetFps = 30) {
  const minFrameTime = 1000 / targetFps // ms
  let lastFrame = performance.now()
  let frameCount = 0
  function loop(now: number) {
    const elapsed = now - lastFrame
    if (elapsed >= minFrameTime) {
      lastFrame = now - (elapsed % minFrameTime) // reduce drift
      frameCount += 1
      render(frameCount)
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
