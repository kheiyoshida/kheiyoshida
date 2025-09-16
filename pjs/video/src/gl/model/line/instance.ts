import { InstancedModel } from '../model'
import { Shader } from '../../shader'
import vert from './line.vert?raw'
import frag from './line.frag?raw'
import { getGL } from '../../gl'

export class LineInstance extends InstancedModel {
  constructor(maxInstanceCount: number) {
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
          name: 'aStart',
          size: 2,
          stride: (2 + 2 + 3) * 4,
          offset: 0,
          divisor: 1,
        },
        {
          name: 'aEnd',
          size: 2,
          stride: (2 + 2 + 3) * 4,
          offset: 2 * 4,
          divisor: 1,
        },
        {
          name: 'aColor',
          size: 3,
          stride: (2 + 2 + 3) * 4,
          offset: (2 + 2) * 4,
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
