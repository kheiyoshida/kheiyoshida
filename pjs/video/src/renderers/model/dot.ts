import { InstancedModel } from './model'
import { Shader } from '../shader'
import instanceVert from '../shaders/instance.vert?raw'
import instanceFrag from '../shaders/instance.frag?raw'
import { getGL } from '../gl'

export class DotInstance extends InstancedModel {
  constructor() {
    const instanceShader = new Shader(instanceVert, instanceFrag)
    // prettier-ignore
    const quadVertices = new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      -0.5, 0.5,
      0.5, 0.5
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
          stride: (2 + 3) * 4,
          offset: 0,
          divisor: 1,
        },
        {
          name: 'aColor',
          size: 3,
          stride: (2 + 3) * 4,
          offset: 2 * 4,
          divisor: 1,
        },
      ]
    )
  }

  override draw() {
    super.draw(getGL().TRIANGLE_STRIP)
  }
}
