import { PixelPresentation } from './presentation'
import { OffScreenPass } from '../gl/pass/offscreen'
import { FrameBuffer } from '../gl/frameBuffer'
import { ImageResolution } from '../media/pixels/types'
import { FrameBufferScreenPass } from '../gl/pass/onscreen'
import { ChannelManager } from './channel/manager'
import { EffectSlot } from './effect/slot'

export class VideoProjectionPipeline {
  private presentationPass: OffScreenPass
  private screenPass: FrameBufferScreenPass

  constructor(
    private readonly channels: ChannelManager,
    private readonly presentations: PixelPresentation[],
    public readonly slots: EffectSlot[] = []
  ) {
    const frameBufferResolution: ImageResolution = { width: 960, height: 540 }
    this.presentationPass = new OffScreenPass(frameBufferResolution)

    this.presentationPass.validate()
    if (!this.presentationPass.frameBuffer) throw Error(`unexpected`)

    if (slots.length == 0) {
      this.screenPass = new FrameBufferScreenPass(this.presentationPass.frameBuffer.tex)
    } else {
      const frameBufferA = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)
      const frameBufferB = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]
        if (i === 0) {
          slot.setInput(this.presentationPass.frameBuffer)
          slot.setOutput(frameBufferA)
        } else if (i % 2 != 0) {
          slot.setInput(frameBufferA)
          slot.setOutput(frameBufferB)
        } else {
          slot.setInput(frameBufferB)
          slot.setOutput(frameBufferA)
        }
      }

      if (slots.length % 2 == 0) {
        this.screenPass = new FrameBufferScreenPass(frameBufferB.tex)
      } else {
        this.screenPass = new FrameBufferScreenPass(frameBufferA.tex)
      }
    }

    this.validate()
  }

  public setBackgroundColor(rgba: [number, number, number, number]): void {
    this.presentationPass.backgroundColor = rgba
  }

  public validate() {
    this.slots.forEach((effect) => effect.offScreenPass.validate())
  }

  public render(): void {
    const channel = this.channels.getChannel()
    const pixels = channel.getPixels()
    const presentations = this.presentations.filter((p) => p.enabled)
    for (const presentation of presentations) {
      presentation.represent(pixels, channel.bufferTex)
    }
    this.presentationPass.render(presentations.map((p) => p.instance))

    for (const slot of this.slots) {
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
