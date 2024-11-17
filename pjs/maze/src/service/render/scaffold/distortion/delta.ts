import { Vector } from 'p5'
import { DistortionDelta } from '../types.ts'
import { randomFloatAsymmetricrange } from 'utils'
import { Position3D } from 'p5utils/src/3d/types.ts'

export const createDistortionDelta = (delta: Vector = new Vector()): DistortionDelta => {
  return {
    get values() {
      return delta.array() as Position3D
    },
    move(range, speed = 1) {
      delta.add(getMovementValues(speed))
      restrainVectorWithinRange(delta, range)
    },
  }
}

export const getMovementValues = (speed: number): Position3D => {
  return [...Array(3)].map(() => randomFloatAsymmetricrange(speed)) as Position3D
}

export const restrainVectorWithinRange = (vector: Vector, range: number): void => {
  if (vector.mag() > range) {
    vector.setMag(range)
  }
}
