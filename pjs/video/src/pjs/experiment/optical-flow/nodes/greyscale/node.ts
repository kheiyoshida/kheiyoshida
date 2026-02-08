import { DrawTarget, RenderingNode, ScreenRect, Shader } from 'graph-gl'
import { PixelDataProviderNode } from '../../../../../lib-node/channel/node'
import vert from './screen.vert?raw'
import grey from './grey.frag?raw'

export class GreyScaleGradientNode extends PixelDataProviderNode {
  private readonly shader: Shader
  public readonly screenRect
  constructor() {
    super()
    this.shader = new Shader(vert, grey)
    this.screenRect = new ScreenRect(this.shader)
    this.drawables.push(this.screenRect)
  }

  private setTexelSize() {
    if (this.renderTarget === undefined) throw new Error('renderTarget is undefined')
    const x = 1 / this.renderTarget.frameBuffer.width
    const y = 1 / this.renderTarget.frameBuffer.height
    this.shader.use()
    this.shader.setUniformFloat2('uTexelSize', x, y)
  }

  public setInput(node: RenderingNode<DrawTarget>) {
    this.screenRect.tex = node.renderTarget!.frameBuffer.colorTexture.tex
    this.setTexelSize()
  }
}
