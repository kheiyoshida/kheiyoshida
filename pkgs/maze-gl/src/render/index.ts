import { MeshRef } from '../load'
import { getGL } from '../webgl'
import { DrawRef } from '../load/geometry'

export const renderMesh = (mesh: MeshRef): void => {
  void mesh.material.use()
  drawGeometry(mesh.drawRef)
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
