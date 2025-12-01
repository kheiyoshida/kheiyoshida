import { Material } from './material'
import { GeometrySpec } from './geometry'
import { DrawRef, loadGeometry } from './geometry/load'
import { getGL } from '../webgl'
import { mat4 } from 'gl-matrix'
import { GenericModel } from 'graph-gl'

export class Mesh {
  constructor(
    private material: Material,
    geometry: GeometrySpec
  ) {
    // super(material.shader, new Float32Array(0), [], getGL().STATIC_DRAW)
    this.#drawRef = loadGeometry(geometry)
  }

  readonly #drawRef: DrawRef

  render(modelMatrix: mat4) {
    this.material.apply()
    this.material.shader.setUniformMatrix4('model', modelMatrix)
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
