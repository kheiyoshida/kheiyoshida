import { ObjectRenderingChannel } from '../../../lib-node/channel/object'
import { ImageResolution } from '../../../media/pixels/types'
import vert from './cube.vert?raw'
import frag from './cube.frag?raw'
import { mat4, vec3 } from 'gl-matrix'
import { RangedValue } from '../utils/rangedValue'
import { randomIntInclusiveBetween } from 'utils'
import { GenericModel, getGL, Shader } from 'graph-gl'

class CubeModel extends GenericModel {
  constructor(color: [number, number, number]) {
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

    this.shader.use()
    this.shader.setUniform3fv('uColor', color)
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
  public scale = new RangedValue(1, 1, 0.2, 2)

  private computeModel() {
    const M = mat4.create()
    mat4.translate(M, M, this.pos)
    mat4.rotateX(M, M, this.rot[0])
    mat4.rotateY(M, M, this.rot[1])
    mat4.rotateZ(M, M, this.rot[2])
    const scale = this.scale.value
    mat4.scale(M, M, [scale, scale, scale])
    return M
  }

  override draw(mode: number = getGL().TRIANGLE_STRIP) {
    const gl = getGL()
    // gl.clearColor(0.4, 0.5, 0.6, 1)
    // gl.clear(gl.COLOR_BUFFER_BIT)

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

  public rotate(speed: number) {
    this.rot[0] += speed
    this.rot[1] += speed * 0.1
  }

  public distort() {
    this.offsets[randomIntInclusiveBetween(0, 7)] = [Math.random(), Math.random(), 0]
  }
}

export class CubeRenderingChannel extends ObjectRenderingChannel {
  public readonly cube: CubeModel
  public readonly cube2: CubeModel
  constructor() {
    const cube = new CubeModel([0, 1, 0])
    const cube2 = new CubeModel([0, 0, 1])
    super([cube, cube2])
    this.cube = cube
    this.cube2 = cube2
  }

  public applyEffect(level: number): void {
    this.cube.rotate(0.1)
    this.cube2.rotate(-0.1)
    this.cube.distort()
    this.cube2.distort()

    this.cube.scale.updateValue(level)
    this.cube2.scale.updateValue(level)
  }
}
