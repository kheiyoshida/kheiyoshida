import { MazeModel } from './model'
import { mat4 } from 'gl-matrix'
import { toRadians } from 'utils'
import { Vec3 } from '../vector'

export class SceneObject {
  constructor(
    private readonly mesh: MazeModel,
    public readonly transform: ObjectTransform = new ObjectTransform()
  ) {}

  draw() {
    this.mesh.drawAtTransform(this.transform.getModelMatrix())
  }
}

export class ObjectTransform {
  constructor({
    scale,
    rotateY,
  }: {
    scale?: number
    rotateY?: number
  } = {}) {
    this.scale = scale ?? 1
    this.rotateY = rotateY ?? 0
  }

  /** in degrees */
  rotateY: number = 0

  scale: number = 1.0

  // todo: consider caching the matrix result
  getModelMatrix(): mat4 {
    const mat = mat4.create()
    mat4.scale(mat, mat, Vec3.create(this.scale)) // scale first for consistency
    mat4.rotateY(mat, mat, toRadians(this.rotateY))
    return mat
  }
}
