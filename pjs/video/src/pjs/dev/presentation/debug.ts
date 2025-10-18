import { ImageResolution } from 'src/media/pixels/types'
import { DotInstance } from '../../../gl/model/dot'
import { PixelPresentation } from '../../../lib-node/presentation/presentation'

export class DebugDotPresentation extends PixelPresentation<DotInstance> {
  constructor(pixelDataResolution: ImageResolution, dotAspectRatio: number = 1) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const dotInstance = new DotInstance(maxInstanceCount, dotAspectRatio)
    super(dotInstance, pixelDataResolution)
  }

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    const intervalX = 8
    const intervalY = 8

    let k = 0
    for (let y = 0; y < resolutionHeight; y += intervalY) {
      for (let x = 0; x < resolutionWidth; x += intervalX) {
        const i = (y * resolutionWidth + x) * 4
        dotInstance.instanceDataArray[k++] = x / resolutionWidth
        dotInstance.instanceDataArray[k++] = y / resolutionHeight

        dotInstance.instanceDataArray[k++] = -0.1 + pixels[i] / 255
        dotInstance.instanceDataArray[k++] = -0.1 + pixels[i + 1] / 255
        dotInstance.instanceDataArray[k++] = -0.1 + pixels[i + 2] / 255

        dotInstance.instanceDataArray[k++] = 0.01
      }
    }
    const finalInstanceCount = k / 6
    dotInstance.updateInstances(finalInstanceCount)
  }
}
