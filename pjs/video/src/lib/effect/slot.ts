import { Shader } from '../../gl/shader'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'
import vert from './shaders/screen.vert?raw'
import frag from './shaders/screen.frag?raw'
import { IEffectModel, ScreenEffectModel } from '../../lib-node/effect/node'

export class EffectSlot {
  public offScreenPass: OffScreenPass
  public effects: IEffectModel[] = []
  private noOpFx: IEffectModel

  public constructor(effects: IEffectModel[]) {
    this.offScreenPass = new OffScreenPass()
    this.effects = effects
    this.noOpFx = new ScreenEffectModel(new Shader(vert, frag))
  }

  public render() {
    const fx = this.effects.find((fx) => fx.enabled)
    if (fx) {
      this.offScreenPass.render([fx])
    } else {
      this.offScreenPass.render([this.noOpFx])
    }
  }

  public setInput(inputFrameBuffer: FrameBuffer): void {
    this.effects.forEach((fx) => fx.setInput(inputFrameBuffer))
    this.noOpFx.setInput(inputFrameBuffer)
  }

  public setOutput(outputFrameBuffer: FrameBuffer): void {
    this.offScreenPass.frameBuffer = outputFrameBuffer
  }
}

export { ScreenEffectModel } from '../../lib-node/effect/node'
export type { IEffectModel, IEffect } from '../../lib-node/effect/node'
