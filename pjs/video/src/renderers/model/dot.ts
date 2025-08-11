import { InstancedModel } from './model'
import { Shader } from '../shader'
import instanceVert from '../shaders/instance.vert?raw'
import instanceFrag from '../shaders/instance.frag?raw'
import { getGL } from '../gl'

export class DotInstance extends InstancedModel {
  constructor(aspectRatio: number = 1) {
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

  public setSize(size: number) {
    this.shader.use()
    this.shader.setUniformFloat('uSize', size)
  }

  override draw() {
    super.draw(getGL().TRIANGLE_STRIP)
  }
}
