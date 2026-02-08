import { DrawTarget, FrameBuffer } from 'graph-gl'
import { PixelParser } from '../../media/pixels/parse'
import { ImageScope } from '../../media/pixels/scope/scope'

export interface ChannelPixelTarget extends DrawTarget {
  pixelDataArray: Uint8Array
}

export class PixelDataRTHandle implements ChannelPixelTarget {
  protected readonly parser: PixelParser
  public readonly scope: ImageScope

  constructor(
    public readonly frameBuffer: FrameBuffer,
    resultResolutionWidth: number = frameBuffer.width
  ) {
    this.scope = new ImageScope(frameBuffer, resultResolutionWidth)
    this.parser = new PixelParser(this.scope)
  }

  get pixelDataArray() {
    if (this.frameBuffer.width === this.scope.finalResolution.width) return (
      this.frameBuffer.pixels
    )
    return this.parser.parsePixelData(this.frameBuffer.pixels)
  }
}
