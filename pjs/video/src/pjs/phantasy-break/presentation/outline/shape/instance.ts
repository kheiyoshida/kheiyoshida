import instanceVert from './instance.vert?raw'
import instanceFrag from './instance.frag?raw'
import { GenericModel, getGL, Shader } from 'graph-gl'

export class Shape extends GenericModel {
  constructor(maxVertexCount: number) {
    const instanceShader = new Shader(instanceVert, instanceFrag)

    // prettier-ignore
    const vertices = new Float32Array(maxVertexCount * 2)
    super(instanceShader, vertices, [
      {
        name: 'aPos',
        size: 2,
        stride: 0,
        offset: 0,
      },
    ])
  }

  override draw() {
    // upload data to GPU
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dataArray)

    this.shader.use()
    this.shader.setUniformFloat('uTime', performance.now())

    super.draw(gl.TRIANGLE_STRIP)
  }

  public setJitterLevel(level: number) {
    this.shader.use()
    this.shader.setUniformFloat('uJitterLevel', level)
  }
}
