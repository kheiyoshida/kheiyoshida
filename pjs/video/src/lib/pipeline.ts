// import { PixelPresentation, PixelPresentationSlot, PostPresentationSlot } from './presentation'
// import { FrameBuffer } from '../gl/frameBuffer'
// import { ImageResolution } from '../media/pixels/types'
// import { FrameBufferScreenPass } from '../gl/pass/onscreen'
// import { ChannelManager } from './channel/manager'
// import { EffectSlot } from './effect/slot'
//
// export class VideoProjectionPipeline {
//   private presentationSlot: PixelPresentationSlot
//   private postPresentationSlot: PostPresentationSlot
//   private screenPass: FrameBufferScreenPass
//
//   constructor(
//     frameBufferResolution: ImageResolution = { width: 960, height: 540 },
//     private readonly channels: ChannelManager,
//     presentations: PixelPresentation[],
//     public readonly fxSlots: EffectSlot[] = [],
//     postPresentations: PixelPresentation[],
//     private finalEffectSlot: EffectSlot,
//   ) {
//
//     const frameBufferA = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)
//     const frameBufferB = new FrameBuffer(frameBufferResolution.width, frameBufferResolution.height)
//
//     // presentation
//     this.presentationSlot = new PixelPresentationSlot(presentations)
//     this.presentationSlot.setOutput(frameBufferA)
//
//     // effects
//     for (let i = 0; i < fxSlots.length; i++) {
//       const slot = fxSlots[i]
//       slot.setInput(i % 2 === 0 ? frameBufferA : frameBufferB)
//       slot.setOutput(i % 2 === 0 ? frameBufferB: frameBufferA)
//     }
//
//     // post presentations - draw on top of the last frame buffer
//     this.postPresentationSlot = new PostPresentationSlot(postPresentations, frameBufferResolution)
//     this.postPresentationSlot.setInput(fxSlots.length % 2 == 0 ? frameBufferA : frameBufferB)
//     this.postPresentationSlot.setOutput(fxSlots.length % 2 == 0 ? frameBufferB : frameBufferA)
//
//     // final effect
//     this.finalEffectSlot.setInput(fxSlots.length % 2 == 0 ? frameBufferB : frameBufferA)
//     this.finalEffectSlot.setOutput(fxSlots.length % 2 == 0 ? frameBufferA : frameBufferB)
//
//     // screen output
//     this.screenPass = new FrameBufferScreenPass(fxSlots.length % 2 == 0 ? frameBufferA.tex : frameBufferB.tex)
//
//     this.validate()
//   }
//
//   public setBackgroundColor(rgba: [number, number, number, number]): void {
//     this.presentationSlot.offScreenPass.backgroundColor = rgba
//     this.screenPass.backgroundColor = rgba
//   }
//
//   public validate() {
//     this.fxSlots.forEach((effect) => effect.offScreenPass.validate())
//   }
//
//   public render(): void {
//     const channel = this.channels.getChannel()
//     const pixels = channel.getPixels()
//
//     this.presentationSlot.render(pixels, channel.bufferTex)
//
//     for (const slot of this.fxSlots) {
//       slot.render()
//     }
//
//     this.postPresentationSlot.render(pixels, channel.bufferTex)
//
//     this.finalEffectSlot.render()
//
//     this.screenPass.render()
//   }
// }
//
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
