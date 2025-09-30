import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../../lib/presentation'
import { DotInstance } from '../../../gl/model/dot'
import { GlyphInstance } from '../../../gl/model/glyph/instance'
import { FntParser } from '../../../media/font/glyph'
import fnt from '../../../assets/fonts/A.fnt?raw'
import { randomItemFromArray } from 'utils'
import { Texture } from '../../../gl/texture'
import fontImageUrl from '../../../assets/fonts/A.png?url'
import { RangedValue } from '../utils/rangedValue'

export class GlyphPresentation extends PixelPresentation<DotInstance> {
  constructor(pixelDataResolution: ImageResolution, dotAspectRatio: number) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height
    const texture = new Texture()
    const dotInstance = new GlyphInstance(maxInstanceCount, texture, dotAspectRatio)
    super(dotInstance, pixelDataResolution)

    this.unitDotSize = 8  / pixelDataResolution.height

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

  private readonly unitDotSize: number

  public dotSize = new RangedValue(0.5, 0.5, 0, 1)

  public densityX = 1.0
  public densityY = 1.0

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height
    const dotInstance = this.instance

    const intervalX = this.densityX == 0 ? resolutionWidth : Math.ceil(8 / this.densityX)
    const intervalY = this.densityY == 0 ? resolutionHeight : Math.ceil(8 / this.densityY)

    const cols = Math.ceil(resolutionWidth / intervalX)
    const rows = Math.ceil(resolutionHeight / intervalY)
    console.log(cols, intervalX, resolutionWidth)

    let k = 0
    for (let y = 0; y < resolutionHeight; y += intervalY) {
      for (let x = 0; x < resolutionWidth; x += intervalX) {
        const i = (y * resolutionWidth + x) * 4

        // offset
        // TODO: change the shader to accept col/row numbers
        const colNum = x / intervalX
        const rowNum = y / intervalY
        dotInstance.instanceDataArray[k++] = (colNum + 0.5) / cols
        dotInstance.instanceDataArray[k++] = (rowNum + 0.5) / rows

        // color
        dotInstance.instanceDataArray[k++] = pixels[i] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 1] / 255
        dotInstance.instanceDataArray[k++] = pixels[i + 2] / 255

        // size
        dotInstance.instanceDataArray[k++] = this.dotSize.value * this.unitDotSize

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
