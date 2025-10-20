import { Drawable, OffscreenDrawNode, OffscreenNode, ScreenRect } from 'graph-gl'
import { PixelPresentation } from './presentation'
import { PixelDataProviderNode } from '../channel/node'

/**
 * draws objects into offscreen buffer,
 * optionally using input's render result (data or frame buffer)
 */
export class PresentationNode extends OffscreenDrawNode {
  constructor(protected readonly presentations: PixelPresentation[]) {
    super()
  }

  private pixelDataInput?: PixelDataProviderNode
  public setPixelDataInput(node: PixelDataProviderNode) {
    this.pixelDataInput = node
  }

  validate() {
    super.validate()
    if (!this.pixelDataInput) throw new Error('pixelDataInput not set')
  }

  render() {
    const data = this.pixelDataInput!.renderTarget!.pixelDataArray
    const tex = this.pixelDataInput!.renderTarget!.frameBuffer.tex

    for (const presentation of this.presentations) {
      if (presentation.enabled) presentation.represent(data, tex)
    }

    super.render()
  }

  override get drawables(): Drawable[] {
    return this.presentations.filter(p => p.enabled).map(p => p.instance)
  }
}

/**
 * draws objects on top of the input's screen result
 */
export class AdditivePresentationNode extends PresentationNode {
  public readonly screenRect: ScreenRect = new ScreenRect()

  constructor(presentations: PixelPresentation[]) {
    super(presentations)
    this.drawables.unshift(this.screenRect) // render screen first, and then draw others = additive
  }

  override get drawables(): Drawable[] {
    return [this.screenRect, ...(this.presentations.filter(p => p.enabled).map(p => p.instance))]
  }

  private frameInput?: OffscreenNode
  public setFrameInput(node: OffscreenNode) {
    this.frameInput = node
    this.screenRect.tex = node.renderTarget!.frameBuffer.tex
  }

  validate() {
    super.validate()
    if (!this.frameInput) throw new Error('frameInput not set')
  }
}
