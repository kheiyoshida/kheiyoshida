import { mat4, vec3 } from 'gl-matrix'

export class OrbitCamera {
  public r = 10
  public phi = 0
  public theta = 0

  public speed = 0.005

  public getViewMatrix() {
    const x = this.r * Math.sin(this.phi) * Math.cos(this.theta);
    const y = this.r * Math.sin(this.phi) * Math.sin(this.theta);
    const z = this.r * Math.cos(this.phi);

    const mat = mat4.create()

    mat4.lookAt(mat, vec3.fromValues(x, y, z), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0))

    return mat
  }

  public getProjectionMatrix(
    fov = Math.PI / 3,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 100
  ) {
    const proj = mat4.create()

    mat4.perspective(proj, fov, aspect, near, far)

    return proj
  }
}
