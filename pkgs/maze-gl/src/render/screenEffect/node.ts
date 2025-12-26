import { OffscreenDrawNode, Shader } from 'graph-gl'
import vert from './shaders/screen.vert?raw'
import frag from './shaders/noOp.frag?raw'
import { ScreenEffectModel } from './model'

export class ScreenEffectNode extends OffscreenDrawNode {
  public readonly effect: ScreenEffectModel
  private readonly noOpFx: ScreenEffectModel

  public constructor(effect: ScreenEffectModel) {
    super()
    this.effect = effect
    this.noOpFx = new ScreenEffectModel(new Shader(vert, frag))
  }

  override get drawables() {
    if (this.enabled) return [this.effect]
    else return [this.noOpFx]
  }

  public setInput(node: OffscreenDrawNode): void {
    const inputFrameBuffer = node.renderTarget!.frameBuffer
    // this.effect.setInput(inputFrameBuffer)
    this.noOpFx.setInput(inputFrameBuffer)
  }

  public enabled = false
}
