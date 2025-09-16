import { InstancedModel } from '../model'
import { Shader } from '../../shader'
import vert from './line.vert?raw'
import frag from './line.frag?raw'
import { getGL } from '../../gl'
import { ImageResolution } from '../../../media/pixels/types'

export class TextureLineInstance extends InstancedModel {
  constructor(maxInstanceCount: number, resolution: ImageResolution) {
    const instanceShader = new Shader(vert, frag)

    // prettier-ignore
    const lineVertices = new Float32Array([
      0, 0,
      1, 1
    ])
    super(
      instanceShader,
      lineVertices,
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
          name: 'aPixelCoord',
          size: 2,
          stride: 2 * 4,
          offset: 0,
          divisor: 1,
        },
      ],
      maxInstanceCount
    )

    this.shader.use()
    this.shader.setUniformInt('uVideoTex', 0)
    this.shader.setUniformFloat2('uResolution', resolution.width, resolution.height)
  }

  override draw() {
    super.draw(getGL().LINES)
  }
}
