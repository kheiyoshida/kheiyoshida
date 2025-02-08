import { DistortionDelta } from '../types.ts'
import { Vec3, Vector3D } from 'maze-gl'

export const createDistortionDelta = (delta: Vector3D = Vec3.create()): DistortionDelta => {
  return {
    get values() {
      return delta
    },
    moveInDirection(range, speed = 1) {
      Vec3.add(delta, Vec3.random(-speed/2, speed/2))
      restrainVectorWithinRange(delta, range)
    },
  }
}

export const restrainVectorWithinRange = (vector: Vector3D, range: number): void => {
  if (Vec3.mag(vector) > range) {
    Vec3.normalize(vector, range)
  }
}
