import { mat4, vec3 } from 'gl-matrix'

export class Camera {
  public position: vec3 = vec3.fromValues(0, 0, 0)
  public lookAtPos: vec3 = vec3.fromValues(0, 0, -1)
  public up: vec3 = vec3.fromValues(0, 1, 0)

  public getViewMatrix() {
    const view = mat4.create()

    mat4.lookAt(view, this.position, this.lookAtPos, this.up)

    return view
  }

  public getProjectionMatrix(
    fov = Math.PI / 3,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 100
  ) {
    const proj = mat4.create()

    mat4.perspective(
      proj,
      fov,
      aspect,
      near,
      far
    )

    return proj
  }
}
