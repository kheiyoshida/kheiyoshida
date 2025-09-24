import { PostEffect } from '../../../lib/effect/effect'
import { Texture } from '../../../gl/texture'
import { GlyphInstance } from '../../../gl/model/glyph/instance'
import { FntParser } from '../../../media/font/glyph'
import { FrameBuffer } from '../../../gl/frameBuffer'
import fnt from '../../../assets/fonts/A.fnt?raw'
import fontImageUrl from '../../../assets/fonts/A.png?url'

export class TextOverlayEffect extends PostEffect {
  private readonly glyphModel: GlyphInstance

  public constructor(
    input: FrameBuffer,
    private output: FrameBuffer,
    private readonly maxLetters: number
  ) {
    if (maxLetters < 1) throw Error('Max Letters must be greater than 1')

    super(output)
    const texture = new Texture()

    // TODO: add screen rect to this.models to blit into output texture from input texture

    this.glyphModel = new GlyphInstance(maxLetters, texture, 1)
    this.models.push(this.glyphModel)

    this.instanceSize = 16 / output.width

    this.parser = new FntParser(fnt, { textureWidth: 512, textureHeight: 512 })

    const image = new Image()
    image.src = fontImageUrl
    image.onload = () => {
      texture.setTextureImage(image)
    }

    // const gl = getGL()
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.disable(gl.DEPTH_TEST);

    this.setText('Aあa亜ア阿')
  }

  private parser: FntParser

  private readonly instanceSize: number

  public setText(text: string) {
    if (text.length > this.maxLetters) throw Error('Max Letters exceeded')

    // TODO: handle text position
    const x = 200
    const y = 200

    // TODO: handle text color
    const color = [1, 0, 0]

    let k = 0;
    for(let i = 0; i < text.length; i++) {
      // offset
      this.glyphModel.instanceDataArray[k++] = (x + i * 20) / this.output.width
      this.glyphModel.instanceDataArray[k++] = (y) / this.output.height

      // color
      this.glyphModel.instanceDataArray[k++] = color[0]
      this.glyphModel.instanceDataArray[k++] = color[1]
      this.glyphModel.instanceDataArray[k++] = color[2]

      // size
      this.glyphModel.instanceDataArray[k++] = this.instanceSize

      // uvs
      const {uvMin, uvMax} = this.parser.getAttributes(text[i])
      this.glyphModel.instanceDataArray[k++] = uvMin[0]
      this.glyphModel.instanceDataArray[k++] = uvMin[1]
      this.glyphModel.instanceDataArray[k++] = uvMax[0]
      this.glyphModel.instanceDataArray[k++] = uvMax[1]
      // TODO: why is this not showing anything??
    }

    this.glyphModel.updateInstances(text.length)
  }

  static factory(maxLetters: number) {
    return (input: FrameBuffer, output: FrameBuffer) => new TextOverlayEffect(input, output, maxLetters)
  }
}
