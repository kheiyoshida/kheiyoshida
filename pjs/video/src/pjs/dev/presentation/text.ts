import { ImageResolution } from 'src/media/pixels/types'
import { PixelPresentation } from '../../../lib/presentation'
import { GlyphInstance } from '../../../gl/model/glyph/instance'
import { FntParser } from '../../../media/font/glyph'
import fnt from '../../../assets/fonts/A.fnt?raw'
import { Texture } from '../../../gl/texture'
import fontImageUrl from '../../../assets/fonts/A.png?url'
import { getGL } from '../../../gl/gl'

export class TextPresentation extends PixelPresentation<GlyphInstance> {
  private tex: WebGLTexture

  constructor(private frameBufferResolution: ImageResolution, private readonly maxLetters: number) {
    const maxInstanceCount = maxLetters
    const texture = new Texture()

    const pixelDataResolution = { width: 960, height: 540 } // doesn't matter
    const dotInstance = new GlyphInstance(maxInstanceCount, texture, 1)
    super(dotInstance, pixelDataResolution)

    this.unitDotSize = 8  / pixelDataResolution.height

    this.parser = new FntParser(fnt, { textureWidth: 512, textureHeight: 512 })

    const image = new Image()
    image.src = fontImageUrl
    image.onload = () => {
      texture.setTextureImage(image)
    }

    this.tex = texture.tex

    this.setText('ああああa')
  }

  private parser: FntParser

  private readonly unitDotSize: number

  public dotSize = 1.0

  public setText(text: string): void {
    // TODO: handle text position
    const x = 200
    const y = 200

    // TODO: handle text color
    const color = [1, 0, 0]

    const resolutionWidth = this.frameBufferResolution.width
    const resolutionHeight = this.frameBufferResolution.height
    const glyphInstance = this.instance

    let k = 0
    for (let i = 0; i < text.length; i++) {
      if (text.length > this.maxLetters) throw Error('Max Letters exceeded')

      // offset
      glyphInstance.instanceDataArray[k++] = (x + i * 20) / resolutionWidth
      glyphInstance.instanceDataArray[k++] = y / resolutionHeight
      console.log((x + i * 20) / resolutionWidth)
      console.log(y / resolutionHeight)

      // color
      glyphInstance.instanceDataArray[k++] = color[0]
      glyphInstance.instanceDataArray[k++] = color[1]
      glyphInstance.instanceDataArray[k++] = color[2]

      // size
      glyphInstance.instanceDataArray[k++] = this.dotSize * this.unitDotSize

      // uvs
      const {uvMin, uvMax} = this.parser.getAttributes(text[i])
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
