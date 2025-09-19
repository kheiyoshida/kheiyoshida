import { PixelChannel } from './channel/channel'
import { PixelPresentation } from './presentation'
import { OffScreenPass } from '../gl/pass/offscreen'
import { EffectFactory, PostEffect } from './effect/effect'
import { FrameBuffer } from '../gl/frameBuffer'
import { ImageResolution } from '../media/pixels/types'
import { FrameBufferScreenPass } from '../gl/pass/onscreen'

export class VideoProjectionPipeline {
  private presentationPass: OffScreenPass
  public readonly postEffects: PostEffect[] = []
  private screenPass: FrameBufferScreenPass

  constructor(
    private readonly channels: PixelChannel[],
    private readonly presentations: PixelPresentation[],
    effects: EffectFactory[] = []
  ) {
    const frameBufferResolution: ImageResolution = { width: 960, height: 540 }
    this.presentationPass = new OffScreenPass(frameBufferResolution)

    if (effects.length == 0) {
      this.screenPass = new FrameBufferScreenPass(this.presentationPass.frameBuffer.tex)
    } else {
      const frameBufferA = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)
      const frameBufferB = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)

      for (let i = 0; i < effects.length; i++) {
        const fxFactory = effects[i]
        if (i === 0) {
          this.postEffects.push(fxFactory(this.presentationPass.frameBuffer, frameBufferA))
        } else if (i % 2 != 0) {
          this.postEffects.push(fxFactory(frameBufferA, frameBufferB))
        } else {
          this.postEffects.push(fxFactory(frameBufferB, frameBufferA))
        }
      }

      if (effects.length % 2 == 0) {
        this.screenPass = new FrameBufferScreenPass(frameBufferB.tex)
      } else {
        this.screenPass = new FrameBufferScreenPass(frameBufferA.tex)
      }
    }
  }

  public setBackgroundColor(rgba: [number, number, number, number]): void {
    this.presentationPass.backgroundColor = rgba
  }

  private channelIndex = 0
  public get currentChannel() {
    return this.channels[this.channelIndex]
  }

  public set channelNumber(value: number) {
    if (value < 0) return;
    this.channelIndex = value % this.channels.length
  }
  public get channelNumber(): number {
    return this.channelIndex;
  }

  public render(retry = 0): void {
    if (!this.currentChannel.isAvailable) {
      this.channelNumber++
      if (retry > this.channels.length) {
        throw new Error("No channel's available")
      }
      return this.render(retry + 1)
    }
    const pixels = this.currentChannel.getPixels()
    const presentations = this.presentations // TODO: maybe filter by on/off
    for (const presentation of presentations) {
      presentation.represent(pixels)
    }
    this.presentationPass.render(presentations.map((p) => p.instance))

    for (const fx of this.postEffects) {
      fx.render()
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
