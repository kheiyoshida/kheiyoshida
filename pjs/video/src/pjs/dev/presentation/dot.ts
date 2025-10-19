import { ImageResolution } from 'src/media/pixels/types'

import { DotInstance } from '../../../gl/model/dot/instance'
import { RangedValue } from '../utils/rangedValue'
import { PixelPresentation } from '../../../lib-node/presentation/presentation'

export class DotPresentation extends PixelPresentation<DotInstance> {
  constructor(pixelDataResolution: ImageResolution, dotAspectRatio: number = 1) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const dotInstance = new DotInstance(maxInstanceCount, dotAspectRatio)
    super(dotInstance, pixelDataResolution)

    this.singleDotSize = 1 / pixelDataResolution.height

    this.densityX.updateValue(1)
    this.densityY.updateValue(1)
    this.dotSize.updateValue(1)
  }

  private readonly singleDotSize: number

  public dotSize = new RangedValue(0.3, 0.3, 0, 1)

  public densityX = new RangedValue(0.5, 1, 0, 1)
  public densityY = new RangedValue(0.5, 1, 0, 1)

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    const intervalX = Math.ceil(1 / this.densityX.value)
    const intervalY = Math.ceil(1 / this.densityY.value)

    const size = this.dotSize.value * this.singleDotSize * 2.0

    let k = 0
    for (let y = 0; y < resolutionHeight; y += intervalY) {
      for (let x = 0; x < resolutionWidth; x += intervalX) {
        const i = (y * resolutionWidth + x) * 4
        dotInstance.instanceDataArray[k++] = x / resolutionWidth
        dotInstance.instanceDataArray[k++] = y / resolutionHeight

        dotInstance.instanceDataArray[k++] = pixels[i] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 1] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 2] / 255

        dotInstance.instanceDataArray[k++] = size
      }
    }
    const finalInstanceCount = k / 6
    dotInstance.updateInstances(finalInstanceCount)
  }
}
