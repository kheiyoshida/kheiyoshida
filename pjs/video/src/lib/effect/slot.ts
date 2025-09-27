import { Shader } from '../../gl/shader'
import { Texture2dModel } from '../../gl/model/screen'
import { GenericModel } from '../../gl/model/model'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'

export type IEffect = {
  setInput(inputFrameBuffer: FrameBuffer): void
  enabled: boolean
}

export type IEffectModel = GenericModel & IEffect

export class EffectSlot {
  public offScreenPass: OffScreenPass
  public effects: IEffectModel[] = []

  public constructor(effects: IEffectModel[]) {
    this.offScreenPass = new OffScreenPass()
    this.effects = effects
  }

  public render() {
    this.offScreenPass.render(this.effects.filter(fx => fx.enabled))
  }

  public setInput(inputFrameBuffer: FrameBuffer): void {
    this.effects.forEach(fx => fx.setInput(inputFrameBuffer))
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
