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
  validate() {
    if (!this.renderTarget) throw new Error(`render target is not set for ${this.constructor.name}`)
  }
}

/**
 * draw models into the target's data array as pixels
 */
export class OffscreenPixelDrawNode extends ModelRenderingNode<DrawPixelTarget> {
  render() {
    this.renderTarget!.frameBuffer.activate()
    super.render()

    const pixels = this.renderTarget!.frameBuffer.readPixels()

    for (let i = 0; i < pixels.length; i++) {
      this.renderTarget!.pixelDataArray[i] = pixels[i]
    }

    this.renderTarget!.frameBuffer.deactivate()
  }
  validate() {
    if (!this.renderTarget) throw new Error(`render target is not set for ${this.constructor.name}`)
  }

  public get outputResolution(): ImageResolution {
    if (!this.renderTarget) throw new Error(`set render target first to get output resolution`)
    return {
      width: this.renderTarget!.frameBuffer.width,
      height: this.renderTarget!.frameBuffer.height,
    }
  }
}

export type OffscreenNode = OffscreenDrawNode | OffscreenPixelDrawNode
