import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../../lib/presentation'
import { GlyphInstance } from '../../../gl/model/glyph/instance'
import { Texture } from '../../../gl/texture'
import { RangedValue } from '../utils/rangedValue'

export interface TextData {
  fnt: string
  fontImageUrl: string
  getNextGlyph(): string
}

export class GlyphPresentation extends PixelPresentation<GlyphInstance> {
  private _currentGlyph: number = 0
  private readonly glyphInstances: GlyphInstance[] = []
  private readonly textDataList: TextData[] = []

  public set currentGlyph(value: number) {
    if (value < 0) this._currentGlyph = 0
    else if (value >= this.textDataList.length) this._currentGlyph = this.textDataList.length -1
    else this._currentGlyph = value
  }
  public get currentGlyph(): number {
    return this._currentGlyph
  }

  public get instance() {
    return this.glyphInstances[this._currentGlyph]
  }

  constructor(pixelDataResolution: ImageResolution, textDataList: TextData[]) {
    const maxInstanceCount = pixelDataResolution.width * pixelDataResolution.height

    const glyphInstances: GlyphInstance[] = []
    for(const text of textDataList) {
      const glyphInstance = new GlyphInstance(maxInstanceCount, new Texture(), text.fnt, text.fontImageUrl)
      glyphInstances.push(glyphInstance)
      console.log(textDataList)
    }
    super(glyphInstances[0], pixelDataResolution)

    this.glyphInstances = glyphInstances
    this.textDataList = textDataList

    this.unitDotSize = 8  / pixelDataResolution.height
  }

  private readonly unitDotSize: number

  public dotSize = new RangedValue(0.5, 0.5, 0, 1)

  public densityX = 1.0
  public densityY = 1.0

  public represent(pixels: Uint8Array): void {
    const resolutionWidth = this.pixelDataResolution.width
    const resolutionHeight = this.pixelDataResolution.height

    const instance = this.glyphInstances[this._currentGlyph]
    const textData = this.textDataList[this._currentGlyph]

    const intervalX = this.densityX == 0 ? resolutionWidth : Math.ceil(8 / this.densityX)
    const intervalY = this.densityY == 0 ? resolutionHeight : Math.ceil(8 / this.densityY)

    const cols = Math.ceil(resolutionWidth / intervalX)
    const rows = Math.ceil(resolutionHeight / intervalY)

    let k = 0
    for (let y = 0; y < resolutionHeight; y += intervalY) {
      for (let x = 0; x < resolutionWidth; x += intervalX) {
        const i = (y * resolutionWidth + x) * 4

        // offset
        // TODO: change the shader to accept col/row numbers
        const colNum = x / intervalX
        const rowNum = y / intervalY
        instance.instanceDataArray[k++] = (colNum + 0.5) / cols
        instance.instanceDataArray[k++] = (rowNum + 0.5) / rows

        // color
        instance.instanceDataArray[k++] = pixels[i] / 255
        instance.instanceDataArray[k++] = pixels[i + 1] / 255
        instance.instanceDataArray[k++] = pixels[i + 2] / 255

        // size
        instance.instanceDataArray[k++] = this.dotSize.value * this.unitDotSize

        // uvs
        const {uvMin, uvMax} = instance.fntParser.getAttributes(textData.getNextGlyph())
        instance.instanceDataArray[k++] = uvMin[0]
        instance.instanceDataArray[k++] = uvMin[1]
        instance.instanceDataArray[k++] = uvMax[0]
        instance.instanceDataArray[k++] = uvMax[1]
      }
    }

    const finalInstanceCount = k / 10
    instance.updateInstances(finalInstanceCount)
  }
}
