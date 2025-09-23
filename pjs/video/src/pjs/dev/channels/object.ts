import { ObjectRenderingChannel } from '../../../lib/channel/object'
import { ImageResolution } from '../../../media/pixels/types'
import { GenericModel } from '../../../gl/model/model'
import { Shader } from '../../../gl/shader'
import vert from './cube.vert?raw'
import frag from './cube.frag?raw'
import { getGL } from '../../../gl/gl'
import { mat4, vec3 } from 'gl-matrix'

class CubeModel extends GenericModel {
  constructor() {
    const shader = new Shader(vert, frag)
    // prettier-ignore
    const vertices = new Float32Array([
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5,  0.5, -0.5,
      -0.5,  0.5, -0.5,
      -0.5, -0.5,  0.5,
      0.5, -0.5,  0.5,
      0.5,  0.5,  0.5,
      -0.5,  0.5,  0.5,
    ])

    super(shader, vertices, [
      {
        name: 'aPos',
        size: 3,
        stride: 0,
        offset: 0,
      },
    ])

    // prettier-ignore
    const idx = new Uint16Array([
      0, 1, 2,  0, 2, 3,
      4, 6, 5,  4, 7, 6,
      0, 3, 7,  0, 7, 4,
      1, 5, 6,  1, 6, 2,
      0, 4, 5,  0, 5, 1,
      3, 2, 6,  3, 6, 7,
    ])

    const gl = getGL()
    gl.bindVertexArray(this.vao)
    const ebo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)
    gl.bindVertexArray(null)
  }

  // uniform location
  private uOffsets = Array.from({ length: 8 }, (_, i) =>
    getGL().getUniformLocation(this.shader.program, `uOffsets[${i}]`)
  )

  // state
  public pos: vec3 = [0, 0, 0]
  public rot: vec3 = [0, 0, 0]
  public readonly offsets = new Array(8).fill(0).map(() => vec3.create())
  public wireframe = false

  private computeModel() {
    const M = mat4.create()
    mat4.translate(M, M, this.pos)
    mat4.rotateX(M, M, this.rot[0])
    mat4.rotateY(M, M, this.rot[1])
    mat4.rotateZ(M, M, this.rot[2])
    return M
  }

  override draw(mode: number = getGL().TRIANGLE_STRIP) {
    const gl = getGL()
    gl.clearColor(0.4, 0.5, 0.6, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    this.shader.use()
    gl.bindVertexArray(this.vao)
    this.shader.setUniformMatrix4fv('uModel', this.computeModel())
    for (let i = 0; i < 8; i++) gl.uniform3fv(this.uOffsets[i], this.offsets[i])

    const idxLength = 36
    if (this.wireframe) {
      for (let t = 0; t < idxLength; t += 3) {
        gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, t * 2)
      }
    } else {
      gl.drawElements(mode, idxLength, gl.UNSIGNED_SHORT, 0)
    }
  }
}

export class CubeRenderingChannel extends ObjectRenderingChannel {
  public readonly cube: CubeModel
  constructor(frameBufferResolution: ImageResolution, outputResolutionWidth: number) {
    super(frameBufferResolution, outputResolutionWidth)
    this.cube = new CubeModel()
    this.models.push(this.cube)
  }
}
