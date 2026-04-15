import { ModelRenderingNode, RenderingNode } from './node'
import { DrawTarget } from '../target'
import { ScreenRect } from '../../model'
import { FrameBuffer } from '../../gl'

/**
 * simply draws models on screen
 */
export class OnscreenRenderingNode extends ModelRenderingNode {
  public override render() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    super.render()
  }
  public validate() {
    return undefined
  }
}

/**
 * draws input node's color result onto screen
 */
export class InputColorRenderingNode extends ModelRenderingNode {
  public readonly screenRect

  constructor() {
    super()
    this.screenRect = new ScreenRect()
    this.drawables.push(this.screenRect)
  }

  public setInput(node: RenderingNode<DrawTarget> | FrameBuffer) {
    if (node instanceof FrameBuffer) {
      this.screenRect.tex = node.colorTexture.tex
    } else {
      this.screenRect.tex = node.renderTarget!.frameBuffer.colorTexture.tex
    }
  }

  public override render() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    super.render()
  }
  public validate() {
    return undefined
  }
}
