import { FrameBuffer, OffscreenDrawNode, Shader } from 'graph-gl'
import vert from './shared/screen.vert?raw'
import frag from './shared/noOp.frag?raw'
import { ScreenEffectModel } from './model'

export abstract class ScreenEffectNode extends OffscreenDrawNode {
  public readonly effect: ScreenEffectModel
  private readonly noOpFx: ScreenEffectModel

  protected constructor(effect: ScreenEffectModel) {
    super()
    this.effect = effect
    this.noOpFx = new ScreenEffectModel(new Shader(vert, frag))
  }

  override get drawables() {
    if (this.enabled) return [this.effect]
    else return [this.noOpFx]
  }

  public setInput(node: OffscreenDrawNode, sceneFrameBuffer: FrameBuffer): void {
    const inputFrameBuffer = node.renderTarget!.frameBuffer
    this.effect.setInput(inputFrameBuffer, sceneFrameBuffer)
    this.noOpFx.setInput(inputFrameBuffer, sceneFrameBuffer)
  }

  public enabled = false

  public override render() {
    this.gl.depthMask(false) // so depth texture won't get overwritten by the screen rect
    super.render()
  }
}
