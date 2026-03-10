import { mat4, quat, vec3 } from 'gl-matrix'

export class Camera {
  public position: vec3 = vec3.fromValues(0, 0, 0)
  // public up: vec3 = vec3.fromValues(0, 1, 0)
  // public lookAtPos: vec3 = vec3.fromValues(0, 0, -1)

  public rotation: vec3 = vec3.fromValues(0, 0, 0)

  // public getViewMatrix() {
  //   const view = mat4.create()
  //
  //   mat4.lookAt(view, this.position, this.lookAtPos, this.up)
  //
  //   return view
  // }

  public speed = 0.005

  public rotateLeft() {
    this.rotation[1] += 0.5
  }
  public rotateRight() {
    this.rotation[1] -= 0.5
  }

  public proceed() {
    const forward = vec3.fromValues(0, 0, -1);
    const q = quat.create();
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
    vec3.transformQuat(forward, forward, q);
    vec3.scale(forward, forward, this.speed);
    vec3.add(this.position, this.position, forward)
  }

  public getViewMatrix() {
    const camera = mat4.create();

    const q = quat.create();
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
    mat4.fromRotationTranslation(camera, q, this.position);

    const view = mat4.create();
    mat4.invert(view, camera);

    return view;
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
