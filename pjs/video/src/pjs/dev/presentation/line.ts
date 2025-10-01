import { PixelPresentation } from '../../../lib/presentation'
import { ImageResolution } from '../../../media/pixels/types'
import { TextureLineInstance } from '../../../gl/model/textureLine/instance'
import { getGL } from '../../../gl/gl'
import { RangedValue } from '../utils/rangedValue'

export class LinePresentation extends PixelPresentation {
  constructor(
    pixelDataResolution: ImageResolution,
  ) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const instance = new TextureLineInstance(maxInstanceCount, pixelDataResolution)
    super(instance, pixelDataResolution)
    this.setupPixelCoords()

    this.instance.shader.use()
    this.setMaxDistanceDirect(2)
    this.setLuminanceThresholdDirect(0.1)
  }

  public setLuminanceThresholdDirect(threshold: number): void {
    this.instance.shader.use()
    this.instance.shader.setUniformFloat('uLuminanceThreshold', threshold)
  }

  public setMaxDistanceDirect(maxDistance: number) {
    this.instance.shader.use()
    this.instance.shader.setUniformInt('uMaxDistance', maxDistance)
  }

  public maxDistance: RangedValue = new RangedValue(4, 12, 4, 40)

  public updateParams(randomComponent: number) {
    if (!this.enabled) return;
    this.setMaxDistanceDirect(this.maxDistance.updateValue(randomComponent))
  }

  public setVertical(value: boolean) {
    this.instance.shader.use()
    this.instance.shader.setUniformInt('uVertical', value ? 1 : 0)
  }

  private setupPixelCoords() {
    let k = 0
    for (let x = 0; x < this.pixelDataResolution.width; x += 1) {
      for (let y = 0; y < this.pixelDataResolution.height; y += 1) {
        this.instance.instanceDataArray[k++] = x / this.pixelDataResolution.width
        this.instance.instanceDataArray[k++] = y / this.pixelDataResolution.height
      }
    }
    this.instance.updateInstances(k / 2)
  }

  represent(_: Uint8Array, pixelChTex?: WebGLTexture) {
    if (!pixelChTex) throw Error('requires texture')
    this.instance.shader.use()
    getGL().bindTexture(getGL().TEXTURE_2D, pixelChTex)
    this.instance.shader.setUniformFloat('uTime', Math.floor(performance.now() / 1000))
    return
  }
}
