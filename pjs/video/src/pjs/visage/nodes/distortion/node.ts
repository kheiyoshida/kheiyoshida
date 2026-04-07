import { OffscreenDrawNode, ScreenRect, Shader } from 'graph-gl'
import vert from './screen.vert?raw'
import frag from './distortion.frag?raw'

export class DistortionNode extends OffscreenDrawNode {
  private readonly shader: Shader
  public readonly screenRect

  constructor() {
    super()
    this.shader = new Shader(vert, frag)
    this.screenRect = new ScreenRect(this.shader)
    this.drawables.push(this.screenRect)
  }

  public setResolution() {
    if (this.renderTarget === undefined) throw new Error('renderTarget is undefined')
    const x = this.renderTarget.frameBuffer.width
    const y = this.renderTarget.frameBuffer.height
    this.shader.use()
    this.shader.setUniformFloat2('uResolution', x, y)
  }

  public setInput(node: OffscreenDrawNode) {
    this.screenRect.tex = node.renderTarget!.frameBuffer.colorTexture.tex
  }

  override render() {
    this.shader.use()
    this.shader.setUniformFloat('uTime', performance.now() * 0.001)
    super.render()
  }
}
