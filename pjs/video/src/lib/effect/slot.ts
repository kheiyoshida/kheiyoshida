import { Shader } from '../../gl/shader'
import { Texture2dModel } from '../../gl/model/screen'
import { GenericModel } from '../../gl/model/model'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'
import vert from './shaders/screen.vert?raw'
import frag from './shaders/screen.frag?raw'

export type IEffect = {
  setInput(inputFrameBuffer: FrameBuffer): void
  enabled: boolean
}

export type IEffectModel = GenericModel & IEffect

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
    const fx = this.effects.find(fx => fx.enabled)
    if (fx) {
      this.offScreenPass.render([fx])
    } else {
      this.offScreenPass.render([this.noOpFx])
    }
  }

  public setInput(inputFrameBuffer: FrameBuffer): void {
    this.effects.forEach(fx => fx.setInput(inputFrameBuffer))
    this.noOpFx.setInput(inputFrameBuffer)
  }

  public setOutput(outputFrameBuffer: FrameBuffer): void {
    this.offScreenPass.frameBuffer = outputFrameBuffer
  }
}

/**
 * screen rect to render frame buffer.
 * note that UVs are inverted
 */
export class ScreenEffectModel extends Texture2dModel implements IEffectModel {
  constructor(screenShader: Shader) {
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 0,
      1, -1,  1, 0,
      -1, 1,  0, 1,
      1, 1,   1, 1
    ])
    super(screenShader, screenRectVertices)
  }

  public setInput(inputFrameBuffer: FrameBuffer): void {
    this.tex = inputFrameBuffer.tex
  }

  public enabled = true
}
