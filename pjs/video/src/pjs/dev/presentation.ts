import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../lib/presentation'
import { DotInstance } from '../../gl/model/dot'

export class DevDotPresentation extends PixelPresentation<DotInstance> {
  constructor(pixelDataResolution: ImageResolution, dotAspectRatio: number) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const dotInstance = new DotInstance(maxInstanceCount, dotAspectRatio)
    super(dotInstance, pixelDataResolution)

    this.singleDotSize = 0.5 / pixelDataResolution.height
  }


  private  singleDotSize: number

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    let k = 0
    for (let y = 0; y < resolutionHeight; y += 1) {
      for (let x = 0; x < resolutionWidth; x += 1) {
        const i = (y * resolutionWidth + x) * 4
        dotInstance.instanceDataArray[k++] = x / resolutionWidth
        dotInstance.instanceDataArray[k++] = y / resolutionHeight

        dotInstance.instanceDataArray[k++] = pixels[i] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 1] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 2] / 255

        const dotSize = 0.3
        dotInstance.instanceDataArray[k++] = dotSize * this.singleDotSize
      }
    }

    const finalInstanceCount = k / 6
    dotInstance.updateInstances(finalInstanceCount)
  }
}
