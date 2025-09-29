import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../../lib/presentation'
import { GlyphInstance } from '../../../gl/model/glyph/instance'
import { FntParser } from '../../../media/font/glyph'
import fnt from '../../../assets/fonts/Alphabets512.fnt?raw'
import { Texture } from '../../../gl/texture'
import fontImageUrl from '../../../assets/fonts/Alphabets512.png?url'
import { getGL } from '../../../gl/gl'

export class TextPresentation extends PixelPresentation<GlyphInstance> {
  private tex: WebGLTexture

  constructor(
    private frameBufferResolution: ImageResolution,
    private readonly maxLetters: number
  ) {
    const maxInstanceCount = maxLetters
    const texture = new Texture()

    const pixelDataResolution = { width: 960, height: 540 } // doesn't matter
    const dotInstance = new GlyphInstance(maxInstanceCount, texture, 1)
    super(dotInstance, pixelDataResolution)

    this.unitDotSize = 1 / frameBufferResolution.height

    this.parser = new FntParser(fnt, { textureWidth: 512, textureHeight: 512 })

    const image = new Image()
    image.src = fontImageUrl
    image.onload = () => {
      texture.setTextureImage(image)
    }

    this.tex = texture.tex

    this.posX = this.frameBufferResolution.height / 2
    this.posY = (this.frameBufferResolution.height - this.fontSize - 8)
  }

  private parser: FntParser

  private readonly unitDotSize: number

  public fontSize = 8.0
  public padding = 4.0

  public color: [number, number, number] = [1, 1, 1]

  public posX: number
  public posY: number

  public setText(text: string): void {
    const x = 0

    const singleFontWidth = this.fontSize + this.padding
    const halfLen = text.length / 2

    const glyphInstance = this.instance

    let k = 0
    for (let i = 0; i < text.length; i++) {
      if (text.length > this.maxLetters) throw Error('Max Letters exceeded')

      // offset
      glyphInstance.instanceDataArray[k++] = (this.posX + (i - halfLen) * singleFontWidth) * this.unitDotSize
      glyphInstance.instanceDataArray[k++] = this.posY * this.unitDotSize

      // color
      glyphInstance.instanceDataArray[k++] = this.color[0]
      glyphInstance.instanceDataArray[k++] = this.color[1]
      glyphInstance.instanceDataArray[k++] = this.color[2]

      // size
      glyphInstance.instanceDataArray[k++] = this.fontSize * this.unitDotSize

      // uvs
      const { uvMin, uvMax } = this.parser.getAttributes(text[i])
      glyphInstance.instanceDataArray[k++] = uvMin[0]
      glyphInstance.instanceDataArray[k++] = uvMin[1]
      glyphInstance.instanceDataArray[k++] = uvMax[0]
      glyphInstance.instanceDataArray[k++] = uvMax[1]
    }

    const finalInstanceCount = k / 10
    glyphInstance.updateInstances(finalInstanceCount)
  }

  public represent(): void {
    this.instance.shader.use()
    getGL().bindTexture(getGL().TEXTURE_2D, this.tex)
    this.instance.shader.setUniformFloat('uTime', Math.floor(performance.now() / 1000))
  }
}
