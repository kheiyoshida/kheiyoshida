import { InstancedModel } from '../gl/model/model'
import { ImageResolution } from '../media/pixels/types'
import { OffScreenPass } from '../gl/pass/offscreen'
import { FrameBuffer } from '../gl/frameBuffer'

export class PixelPresentationSlot {
  public readonly offScreenPass: OffScreenPass

  constructor(private readonly presentations: PixelPresentation[]) {
    this.offScreenPass = new OffScreenPass()
  }

  public represent(pixels: Uint8Array, channelTex: WebGLTexture) {
    const presentations = this.presentations.filter((p) => p.enabled)
    for (const presentation of presentations) {
      presentation.represent(pixels, channelTex)
    }
    this.offScreenPass.render(presentations.map((p) => p.instance))
  }

  public setOutput(frameBuffer: FrameBuffer) {
    this.offScreenPass.frameBuffer = frameBuffer
  }
}

export abstract class PixelPresentation<I extends InstancedModel = InstancedModel> {
  private _pixelDataResolution: ImageResolution
  public get pixelDataResolution() {
    return this._pixelDataResolution
  }
  public set pixelDataResolution(value: ImageResolution) {
    if (
      value.width * value.height >
      this.maximumPixelDataResolution.width * this.maximumPixelDataResolution.height
    ) {
      console.error("it shouldn't allocate more than maximum")
      return
    }
    this._pixelDataResolution = value
  }

  protected constructor(
    public readonly instance: I,
    private readonly maximumPixelDataResolution: ImageResolution
  ) {
    this._pixelDataResolution = maximumPixelDataResolution
  }

  public abstract represent(parsedPixels: Uint8Array, pixelChTex?: WebGLTexture): void

  public enabled = true
}
