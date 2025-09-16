import { PixelPresentation } from '../../../lib/presentation'
import { ImageResolution } from '../../../media/pixels/types'
import { TextureLineInstance } from '../../../gl/model/textureLine/instance'

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
    return
  }
}
