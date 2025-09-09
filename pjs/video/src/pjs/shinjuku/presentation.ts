import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../lib/presentation'
import { DotInstance } from '../../gl/model/dot'
import { clamp, makeIntWobbler } from 'utils'

export class DotPresentation extends PixelPresentation<DotInstance> {
  constructor(pixelDataResolution: ImageResolution, dotAspectRatio: number) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const dotInstance = new DotInstance(maxInstanceCount, dotAspectRatio)
    super(dotInstance, pixelDataResolution)

    this.singleDotSize = 0.5 / pixelDataResolution.height
  }

  public get pixelDataResolution() {
    return super.pixelDataResolution
  }

  public set pixelDataResolution(value: ImageResolution) {
    this.singleDotSize = 0.5 / value.height
    super.pixelDataResolution = value
  }

  private singleDotSize: number

  public wave: number = 0

  public represent(parsedPixels: Uint8Array): void {
    const wiggle = makeIntWobbler(clamp(this.wave * 8, 1, 10))
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    let k = 0
    for (let y = 0; y < resolutionHeight; y += 1) {
      for (let x = 0; x < resolutionWidth; x += 1) {
        const i = (y * resolutionWidth + x) * 4
        if (parsedPixels[i + 2] > 70 + this.wave * 30) {
          dotInstance.instanceDataArray[k++] = wiggle(x) / resolutionWidth
          dotInstance.instanceDataArray[k++] = wiggle(y) / resolutionHeight

          const brightnessLevel = parsedPixels[i + 2] / 255
          dotInstance.instanceDataArray[k++] = brightnessLevel / 2
          dotInstance.instanceDataArray[k++] = brightnessLevel
          dotInstance.instanceDataArray[k++] = brightnessLevel

          const dotSize = clamp((1 + this.wave) / 10, 0.25, 0.3)
          dotInstance.instanceDataArray[k++] = dotSize * this.singleDotSize
        }
      }
    }

    const finalInstanceCount = k / 6
    dotInstance.updateInstances(finalInstanceCount)
  }
}
