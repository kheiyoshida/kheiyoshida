import { mat4, quat, vec3 } from 'gl-matrix'

export class Camera {
  public position: vec3 = vec3.fromValues(0, 0, 0)

  public rotation: vec3 = vec3.fromValues(0, 0, 0)

  public speed = 0.005
  public rotSpeed = 0.5

  public rotateLeft() {
    this.rotation[1] += this.rotSpeed
  }
  public rotateRight() {
    this.rotation[1] -= this.rotSpeed
  }

  public proceed(forward = true) {
    const direction = vec3.fromValues(0, 0, forward ? -1 : 1)
    const q = quat.create()
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2])
    vec3.transformQuat(direction, direction, q)
    vec3.scale(direction, direction, this.speed)
    vec3.add(this.position, this.position, direction)
  }

  public getViewMatrix() {
    const camera = mat4.create()

    const q = quat.create()
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2])
    mat4.fromRotationTranslation(camera, q, this.position)

    const view = mat4.create()
    mat4.invert(view, camera)

    return view
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
