import vert from './cube.vert?raw'
import frag from './cube.frag?raw'
import { mat4, vec3 } from 'gl-matrix'
import { GenericModel } from '../../model'
import { getGL, Shader } from '../../gl'

export class CubeModel extends GenericModel {
  public constructor() {
    const shader = new Shader(vert, frag)
    // prettier-ignore
    const vertices = new Float32Array([
      // Front face (0–5)
      -0.5, -0.5,  0.5,   0, 0, 1,
       0.5, -0.5,  0.5,   0, 0, 1,
       0.5,  0.5,  0.5,   0, 0, 1,
      -0.5, -0.5,  0.5,   0, 0, 1,
       0.5,  0.5,  0.5,   0, 0, 1,
      -0.5,  0.5,  0.5,   0, 0, 1,

      // Back face (6–11)
      -0.5, -0.5, -0.5,   0, 0, -1,
       0.5,  0.5, -0.5,   0, 0, -1,
       0.5, -0.5, -0.5,   0, 0, -1,
      -0.5, -0.5, -0.5,   0, 0, -1,
      -0.5,  0.5, -0.5,   0, 0, -1,
       0.5,  0.5, -0.5,   0, 0, -1,

      // Left face (12–17)
      -0.5, -0.5, -0.5,  -1, 0, 0,
      -0.5,  0.5,  0.5,  -1, 0, 0,
      -0.5, -0.5,  0.5,  -1, 0, 0,
      -0.5, -0.5, -0.5,  -1, 0, 0,
      -0.5,  0.5, -0.5,  -1, 0, 0,
      -0.5,  0.5,  0.5,  -1, 0, 0,

      // Right face (18–23)
       0.5, -0.5, -0.5,   1, 0, 0,
       0.5, -0.5,  0.5,   1, 0, 0,
       0.5,  0.5,  0.5,   1, 0, 0,
       0.5, -0.5, -0.5,   1, 0, 0,
       0.5,  0.5,  0.5,   1, 0, 0,
       0.5,  0.5, -0.5,   1, 0, 0,

      // Top face (24–29)
      -0.5,  0.5,  0.5,   0, 1, 0,
       0.5,  0.5, -0.5,   0, 1, 0,
       0.5,  0.5,  0.5,   0, 1, 0,
      -0.5,  0.5,  0.5,   0, 1, 0,
      -0.5,  0.5, -0.5,   0, 1, 0,
       0.5,  0.5, -0.5,   0, 1, 0,

      // Bottom face (30–35)
      -0.5, -0.5,  0.5,   0, -1, 0,
       0.5, -0.5,  0.5,   0, -1, 0,
       0.5, -0.5, -0.5,   0, -1, 0,
      -0.5, -0.5,  0.5,   0, -1, 0,
       0.5, -0.5, -0.5,   0, -1, 0,
      -0.5, -0.5, -0.5,   0, -1, 0,
    ])

    super(shader, vertices, [
      { name: 'aPos', size: 3, stride: 24, offset: 0 },
      { name: 'aNormal', size: 3, stride: 24, offset: 12 },
    ])
  }

  // state
  public pos: vec3 = [0, 0, 0]
  public rot: vec3 = [0, 0, 0]
  public wireframe = false
  public scale = 1

  private computeModel() {
    const M = mat4.create()
    mat4.translate(M, M, this.pos)
    mat4.rotateX(M, M, this.rot[0])
    mat4.rotateY(M, M, this.rot[1])
    mat4.rotateZ(M, M, this.rot[2])
    const scale = this.scale
    mat4.scale(M, M, [scale, scale, scale])
    return M
  }

  override draw(mode: number = getGL().TRIANGLES) {
    const gl = getGL()

    this.shader.use()
    gl.bindVertexArray(this.vao)
    this.shader.setUniformMatrix4('uModel', this.computeModel())

    gl.drawArrays(mode, 0, 36)
  }

  public rotate(speed: number) {
    this.rot[0] += speed * 0.01
    this.rot[1] += speed
  }
}
