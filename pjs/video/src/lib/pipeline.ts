import { PixelPresentation } from './presentation'
import { OffScreenPass } from '../gl/pass/offscreen'
import { EffectFactory, PostEffect } from './effect/effect'
import { FrameBuffer } from '../gl/frameBuffer'
import { ImageResolution } from '../media/pixels/types'
import { FrameBufferScreenPass } from '../gl/pass/onscreen'
import { ChannelManager } from './channel/manager'

export class VideoProjectionPipeline {
  private presentationPass: OffScreenPass
  public readonly postEffects: PostEffect[] = []
  private screenPass: FrameBufferScreenPass

  constructor(
    private readonly channels: ChannelManager,
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
          const fx = fxFactory(this.presentationPass.frameBuffer, frameBufferA)
          fx.setInput(this.presentationPass.frameBuffer)
          this.postEffects.push(fx)
        } else if (i % 2 != 0) {
          const fx = fxFactory(frameBufferA, frameBufferB)
          fx.setInput(frameBufferA)
          this.postEffects.push(fx)
        } else {
          const fx = fxFactory(frameBufferB, frameBufferA)
          fx.setInput(frameBufferB)
          this.postEffects.push(fx)
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

  public render(): void {
    const channel = this.channels.getChannel()
    const pixels = channel.getPixels()
    const presentations = this.presentations.filter(p => p.enabled)
    for (const presentation of presentations) {
      presentation.represent(pixels, channel.bufferTex)
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
