import { InstancedModel } from '../model'
import { Shader } from '../../shader'
import instanceVert from './glyph.vert?raw'
import instanceFrag from './glyph.frag?raw'
import { getGL } from '../../gl'
import { Texture } from '../../texture'

export class GlyphInstance extends InstancedModel {
  constructor(maxInstanceCount: number, aspectRatio: number = 1) {
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
  }

  public setTexture(texture: Texture) {
    this.shader.use()
    this.shader.setUniformInt('uFontAtlas', texture.id)
  }

  override draw() {
    super.draw(getGL().TRIANGLE_STRIP)
  }
}
