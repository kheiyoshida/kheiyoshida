import { Material } from './material'
import { GeometrySpec } from './geometry'
import { DrawRef, loadGeometry } from './geometry/load'
import { getGL } from '../webgl'
import { mat4 } from 'gl-matrix'

export type MeshVariables = {
  /**
   * in angles
   */
  rotateY: number
}

export class Mesh {
  constructor(
    private material: Material,
    geometry: GeometrySpec,
    public uniforms: MeshVariables = {
      rotateY: 0,
    }
  ) {
    this.#drawRef = loadGeometry(geometry)
  }

  readonly #drawRef: DrawRef

  render() {
    this.material.apply()
    this.material.shader.setMat4('unit', rotateY(this.uniforms.rotateY))
    drawGeometry(this.#drawRef)
  }
}

const toRadians = (degree: number) => degree * (Math.PI / 180)

const rotateY = (angles: number) => {
  const mat = mat4.create()
  mat4.rotateY(mat, mat, toRadians(angles))
  return mat
}

/**
 * draw a specified geometry stored in the buffer
 */
const drawGeometry = (ref: DrawRef): void => {
  const gl = getGL()
  gl.bindVertexArray(ref.vao)
  gl.drawArrays(gl.TRIANGLES, ref.start, ref.end)
  gl.bindVertexArray(null)
}
