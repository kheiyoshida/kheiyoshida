import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../../lib/presentation'
import { DotInstance } from '../../../gl/model/dot'
import { GlyphInstance } from '../../../gl/model/glyph/instance'
import { FntParser } from '../../../media/font/glyph'
import fnt from '../../../assets/fonts/A.fnt?raw'
import { randomItemFromArray } from 'utils'
import { Texture } from '../../../gl/texture'
import fontImageUrl from '../../../assets/fonts/A.png?url'

export class GlyphPresentation extends PixelPresentation<DotInstance> {
  constructor(pixelDataResolution: ImageResolution, dotAspectRatio: number) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const texture = new Texture()
    const dotInstance = new GlyphInstance(maxInstanceCount, texture, dotAspectRatio)
    super(dotInstance, pixelDataResolution)

    this.singleDotSize = (10 * 0.5) / pixelDataResolution.height

    this.parser = new FntParser(fnt, { textureWidth: 512, textureHeight: 512 })

    const image = new Image()
    image.src = fontImageUrl
    image.onload = () => {
      texture.setTextureImage(image)
    }
  }

  private parser: FntParser

  private As = 'Aあa亜ア阿 '.split('')
  private pickGlyph() {
    return randomItemFromArray(this.As)
  }

  private readonly singleDotSize: number

  public dotSize = 0.3

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    let k = 0
    for (let y = 0; y < resolutionHeight; y += 10) {
      for (let x = 0; x < resolutionWidth; x += 10) {
        const i = (y * resolutionWidth + x) * 4
        // offset
        dotInstance.instanceDataArray[k++] = x / resolutionWidth
        dotInstance.instanceDataArray[k++] = y / resolutionHeight

        // color
        dotInstance.instanceDataArray[k++] = pixels[i] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 1] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 2] / 255

        // size
        dotInstance.instanceDataArray[k++] = this.dotSize * this.singleDotSize

        // uvs
        const {uvMin, uvMax} = this.parser.getAttributes(this.pickGlyph())
        dotInstance.instanceDataArray[k++] = uvMin[0]
        dotInstance.instanceDataArray[k++] = uvMin[1]
        dotInstance.instanceDataArray[k++] = uvMax[0]
        dotInstance.instanceDataArray[k++] = uvMax[1]
      }
    }

    const finalInstanceCount = k / 10
    dotInstance.updateInstances(finalInstanceCount)
  }
}
