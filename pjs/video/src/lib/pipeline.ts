import { PixelPresentation, PixelPresentationSlot } from './presentation'
import { FrameBuffer } from '../gl/frameBuffer'
import { ImageResolution } from '../media/pixels/types'
import { FrameBufferScreenPass } from '../gl/pass/onscreen'
import { ChannelManager } from './channel/manager'
import { EffectSlot } from './effect/slot'

export class VideoProjectionPipeline {
  private screenPass: FrameBufferScreenPass
  private presentationSlot: PixelPresentationSlot

  constructor(
    private readonly channels: ChannelManager,

    presentations: PixelPresentation[],
    public readonly fxSlots: EffectSlot[] = []
  ) {
    const frameBufferResolution: ImageResolution = { width: 960, height: 540 }

    const frameBufferA = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)
    const frameBufferB = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)

    // presentation
    this.presentationSlot = new PixelPresentationSlot(presentations)
    this.presentationSlot.setOutput(frameBufferA)

    for (let i = 0; i < fxSlots.length; i++) {
      const slot = fxSlots[i]
      if (i % 2 === 0) {
        slot.setInput(frameBufferA)
        slot.setOutput(frameBufferB)
      } else {
        slot.setInput(frameBufferB)
        slot.setOutput(frameBufferA)
      }
    }

    if (fxSlots.length % 2 == 0) {
      this.screenPass = new FrameBufferScreenPass(frameBufferA.tex)
    } else {
      this.screenPass = new FrameBufferScreenPass(frameBufferB.tex)
    }

    this.validate()
  }

  public setBackgroundColor(rgba: [number, number, number, number]): void {
    this.presentationSlot.offScreenPass.backgroundColor = rgba
    this.screenPass.backgroundColor = rgba
  }

  public validate() {
    this.fxSlots.forEach((effect) => effect.offScreenPass.validate())
  }

  public render(): void {
    const channel = this.channels.getChannel()
    const pixels = channel.getPixels()

    this.presentationSlot.represent(pixels, channel.bufferTex)

    for (const slot of this.fxSlots) {
      slot.render()
    }

    this.screenPass.render()
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
