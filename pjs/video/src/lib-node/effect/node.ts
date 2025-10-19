import { FrameBuffer, GenericModel, OffscreenDrawNode, Shader, Texture2dModel } from 'graph-gl'
import vert from './shaders/screen.vert?raw'
import frag from './shaders/screen.frag?raw'

export type IEffect = {
  setInput(inputFrameBuffer: FrameBuffer): void
  enabled: boolean
}

export type IEffectModel = GenericModel & IEffect

export class EffectNode extends OffscreenDrawNode {
  public effects: IEffectModel[] = []
  private readonly noOpFx: IEffectModel

  public constructor(effects: IEffectModel[]) {
    super()
    this.effects = effects
    this.noOpFx = new ScreenEffectModel(new Shader(vert, frag))
  }

  override get drawables() {
    const fx = this.effects.find((fx) => fx.enabled)
    if (fx) {
      return [fx]
    } else {
      return [this.noOpFx]
    }
  }

  public setInput(node: OffscreenDrawNode): void {
    const inputFrameBuffer = node.renderTarget!.frameBuffer
    this.effects.forEach((fx) => fx.setInput(inputFrameBuffer))
    this.noOpFx.setInput(inputFrameBuffer)
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
