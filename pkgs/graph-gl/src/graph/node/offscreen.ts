import { ModelRenderingNode } from './node'
import { DrawPixelTarget, DrawTarget } from '../target'

export type ImageResolution = {
  width: number
  height: number
}

export class OffscreenDrawNode extends ModelRenderingNode<DrawTarget> {
  render() {
    this.renderTarget!.frameBuffer.activate()
    super.render()
    this.renderTarget!.frameBuffer.deactivate()
  }
}

export class OffscreenPixelDrawNode extends ModelRenderingNode<DrawPixelTarget> {
  render() {
    this.renderTarget!.frameBuffer.activate()
    super.render()
    this.renderTarget!.pixelDataArray = this.renderTarget!.frameBuffer.readPixels()
    this.renderTarget!.frameBuffer.deactivate()
  }
}
