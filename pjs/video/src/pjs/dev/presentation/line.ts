import { PixelPresentation } from '../../../lib/presentation'
import { ImageResolution } from '../../../media/pixels/types'
import { TextureLineInstance } from '../../../gl/model/textureLine/instance'
import { randomIntInclusiveBetween } from 'utils'

export class DevLinePresentation extends PixelPresentation {
  constructor(
    pixelDataResolution: ImageResolution,
    public threshold = 30,
    public step = 5
  ) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const instance = new TextureLineInstance(maxInstanceCount, pixelDataResolution)
    super(instance, pixelDataResolution)
    this.setupPixelCoords()

    this.instance.shader.use()
    this.instance.shader.setUniformInt('uMaxDistance', randomIntInclusiveBetween(2, 24))
    this.instance.shader.setUniformFloat('uLuminanceThreshold', 0.03)
  }

  public setMaxDistance(maxDistance: number) {
    this.instance.shader.use()
    this.instance.shader.setUniformInt('uMaxDistance', maxDistance)
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

  represent() {
    this.instance.shader.use()
    this.instance.shader.setUniformFloat('uTime', Math.floor(performance.now() / 1000))
    return
  }
}
