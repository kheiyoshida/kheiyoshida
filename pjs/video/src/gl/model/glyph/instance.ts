import instanceVert from './glyph.vert?raw'
import instanceFrag from './glyph.frag?raw'
import { FntParser } from '../../../media/font/glyph'
import { getGL, InstancedModel, Shader, Texture } from 'graph-gl'

export class GlyphInstance extends InstancedModel {
  public readonly fntParser: FntParser

  constructor(
    maxInstanceCount: number,
    private readonly texture: Texture,
    fnt: string,
    fontImageUrl: string,
    aspectRatio: number = 1
  ) {
    const instanceShader = new Shader(instanceVert, instanceFrag)

    const gl = getGL()
    const screenAspectRatio = gl.canvas.width / gl.canvas.height
    const h = 1
    const w = aspectRatio / screenAspectRatio

    // prettier-ignore
    const quadVertices = new Float32Array([
      -w, -h,
      w, -h,
      -w, h,
      w, h
    ])
    super(
      instanceShader,
      quadVertices,
      [
        {
          name: 'aPos',
          size: 2,
          stride: 0,
          offset: 0,
        },
      ],
      [
        {
          name: 'aOffset',
          size: 2,
          stride: (2 + 3 + 1 + 2 + 2) * 4,
          offset: 0,
          divisor: 1,
        },
        {
          name: 'aColor',
          size: 3,
          stride: (2 + 3 + 1 + 2 + 2) * 4,
          offset: 2 * 4,
          divisor: 1,
        },
        {
          name: 'aSize',
          size: 1,
          stride: (2 + 3 + 1 + 2 + 2) * 4,
          offset: (2 + 3) * 4,
          divisor: 1,
        },
        {
          name: 'aUvMin',
          size: 2,
          stride: (2 + 3 + 1 + 2 + 2) * 4,
          offset: (2 + 3 + 1) * 4,
          divisor: 1,
        },
        {
          name: 'aUvMax',
          size: 2,
          stride: (2 + 3 + 1 + 2 + 2) * 4,
          offset: (2 + 3 + 1 + 2) * 4,
          divisor: 1,
        },
      ],
      maxInstanceCount
    )

    this.fntParser = new FntParser(fnt, { textureWidth: 512, textureHeight: 512 })
    const image = new Image()
    image.src = fontImageUrl
    image.onload = () => {
      texture.setTextureImage(image)
    }

    this.shader.use()
    this.shader.setUniformInt('uFontAtlas', 0)
  }

  override draw() {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.texture.tex)
    super.draw(getGL().TRIANGLE_STRIP)
  }
}
