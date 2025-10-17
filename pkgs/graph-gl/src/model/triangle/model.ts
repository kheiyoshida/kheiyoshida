import vert from './triangle.vert?raw'
import frag from './triangle.frag?raw'
import { GenericModel } from '../model'
import { Shader } from '../../gl/shader'

export class TriangleModel extends GenericModel {
  constructor() {
    const shader = new Shader(vert, frag)
    // prettier-ignore
    const vertices = new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      0, 0.5
    ])

    super(shader, vertices, [
      {
        name: 'aPos',
        size: 2,
        stride: 0,
        offset: 0,
      },
    ])

    this.shader.use()
  }
}
