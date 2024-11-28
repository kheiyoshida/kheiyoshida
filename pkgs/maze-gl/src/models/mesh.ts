import { Material } from './material'
import { GeometrySpec } from './geometry'
import { DrawRef, loadGeometry } from './geometry/load'
import { getGL } from '../webgl'
import { mat4 } from 'gl-matrix'
import { toRadians } from 'utils'
import { Vec3 } from '../vector'

export class Mesh {
  constructor(
    private material: Material,
    geometry: GeometrySpec
  ) {
    this.#drawRef = loadGeometry(geometry)
    this.state = new MeshState()
  }

  state: MeshState

  readonly #drawRef: DrawRef

  render() {
    this.material.apply()
    this.material.shader.setMat4('model', this.state.getModelMatrix())
    this.#drawGeometry()
  }

  /**
   * draw a specified geometry stored in the buffer
   */
  #drawGeometry() {
    const gl = getGL()
    gl.bindVertexArray(this.#drawRef.vao)
    gl.drawArrays(gl.TRIANGLES, this.#drawRef.start, this.#drawRef.end)
    gl.bindVertexArray(null)
  }
}

/**
 * state manager that can return the current state as a model matrix,
 * which Mesh can use before render()
 */
class MeshState {
  #rotateY: number = 0
  #scale: number = 1.0

  #modelMatrix = mat4.create()

  getModelMatrix(): mat4 {
    return this.#modelMatrix
  }

  #rebuildMatrix(): void {
    const mat = mat4.create()
    mat4.scale(mat, mat, Vec3.create(this.#scale)) // scale first for consistency
    mat4.rotateY(mat, mat, toRadians(this.#rotateY))
    this.#modelMatrix = mat;
  }

  incrementRotation(amount = 1): void {
    this.#rotateY += amount
    this.#rebuildMatrix()
  }

  set rotateY(value: number) {
    this.#rotateY = value
    this.#rebuildMatrix()
  }

  set scale(value: number) {
    this.#scale = value
    this.#rebuildMatrix()
  }
}
