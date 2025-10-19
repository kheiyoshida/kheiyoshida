import { InstancedModel } from 'graph-gl'
import { ImageResolution } from '../../media/pixels/types'

export abstract class PixelPresentation<I extends InstancedModel = InstancedModel> {
  public get instance(): I {
    return this._instance
  }

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
    private readonly _instance: I,
    private readonly maximumPixelDataResolution: ImageResolution
  ) {
    this._pixelDataResolution = maximumPixelDataResolution
  }

  public abstract represent(parsedPixels: Uint8Array, pixelChTex?: WebGLTexture): void

  public enabled = true
}
