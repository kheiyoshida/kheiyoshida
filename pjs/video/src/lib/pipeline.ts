import { PixelChannel } from './channel/channel'
import { PixelPresentation } from './presentation'
import { ScreenPass } from '../gl/pass/pass'

export class VideoProjectionPipeline {
  constructor(
    private readonly channels: PixelChannel[],
    private readonly presentations: PixelPresentation[]
  ) {}

  public setBackgroundColor(rgba: [number, number, number, number]): void {
    this.screenPass.backgroundColor = rgba
  }

  private screenPass = new ScreenPass()

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
    this.screenPass.render(presentations.map((p) => p.instance))
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
