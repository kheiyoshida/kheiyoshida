import { ModelRenderingNode } from './node'
import { DrawPixelTarget, DrawTarget } from '../target'

export type ImageResolution = {
  width: number
  height: number
}

/**
 * draw models into offscreen frame buffer
 */
export class OffscreenDrawNode extends ModelRenderingNode<DrawTarget> {
  render() {
    this.renderTarget!.frameBuffer.activate()
    super.render()
    this.renderTarget!.frameBuffer.deactivate()
  }
}

/**
 * draw models into the target's data array as pixels
 */
export class OffscreenPixelDrawNode extends ModelRenderingNode<DrawPixelTarget> {
  render() {
    this.renderTarget!.frameBuffer.activate()
    super.render()
    this.renderTarget!.pixelDataArray = this.renderTarget!.frameBuffer.readPixels()
    this.renderTarget!.frameBuffer.deactivate()
  }
}
