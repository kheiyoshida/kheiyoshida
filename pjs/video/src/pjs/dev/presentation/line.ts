import { PixelPresentation } from '../../../lib/presentation'
import { randomIntInclusiveBetween } from 'utils'
import { ImageResolution } from '../../../media/pixels/types'
import { LineInstance } from '../../../gl/model/line/instance'

export class DevLinePresentation extends PixelPresentation {
  constructor(pixelDataResolution: ImageResolution) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const instance = new LineInstance(maxInstanceCount)
    super(instance, pixelDataResolution)
  }
  public threshold: number = 30

  private readonly list: number[] = []

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    this.list.length = 0
    for (let y = 0; y < resolutionHeight; y += 1) {
      for (let x = 0; x < resolutionWidth; x += 1) {
        const i = (y * resolutionWidth + x) * 4
        const r = pixels[i]
        if (r === this.threshold) {
          this.list.push(
            (x / resolutionWidth - 0.5) * 2,
            (y / resolutionHeight - 0.5) * 2,
          )
        }
      }
    }


    let k = 0
    for(let i = 0; i < this.list.length / 2; i++) {
      // start
      dotInstance.instanceDataArray[k++] = this.list[i]
      dotInstance.instanceDataArray[k++] = this.list[i + 1]

      // end
      const r = randomIntInclusiveBetween(0, (this.list.length / 2) - 1) * 2
      dotInstance.instanceDataArray[k++] = this.list[r]
      dotInstance.instanceDataArray[k++] = this.list[r + 1]

      // color
      dotInstance.instanceDataArray[k++] = 1
      dotInstance.instanceDataArray[k++] = 1
      dotInstance.instanceDataArray[k++] = 1
    }

    const finalInstanceCount = k / 7

    dotInstance.updateInstances(finalInstanceCount)
  }
}
