import instanceVert from './instance.vert?raw'
import instanceFrag from './instance.frag?raw'
import { getGL, InstancedModel, Shader } from 'graph-gl'

export class MotionInstance extends InstancedModel {
  constructor(maxInstanceCount: number) {
    const instanceShader = new Shader(instanceVert, instanceFrag)

    const gl = getGL()

    // prettier-ignore
    const vertices = new Float32Array([
      0, 0,
      1, 1,
    ])
    super(
      instanceShader,
      vertices,
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
          name: 'aStart',
          size: 2,
          stride: (2 + 2) * 4,
          offset: 0,
          divisor: 1,
        },
        {
          name: 'aEnd',
          size: 2,
          stride: (2 + 2) * 4,
          offset: 2 * 4,
          divisor: 1,
        },
      ],
      maxInstanceCount
    )
  }

  override draw() {
    super.draw(getGL().LINES)
  }
}
