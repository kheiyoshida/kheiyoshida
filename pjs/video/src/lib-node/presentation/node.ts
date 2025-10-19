import { OffscreenDrawNode, OffscreenNode, OffscreenPixelDrawNode, ScreenRect } from 'graph-gl'
import { PixelPresentation } from './presentation'

/**
 * draws objects into offscreen buffer,
 * optionally using input's render result (data or frame buffer)
 */
export class PresentationNode extends OffscreenDrawNode {
  constructor(private readonly presentations: PixelPresentation[]) {
    super()
    this.drawables = this.presentations.map((p) => p.instance)
  }

  private pixelDataInput?: OffscreenPixelDrawNode
  public setPixelDataInput(node: OffscreenPixelDrawNode) {
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
      presentation.represent(data, tex)
    }

    super.render()
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
