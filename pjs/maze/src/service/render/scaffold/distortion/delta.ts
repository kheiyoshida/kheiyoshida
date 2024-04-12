import { Vector } from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { DistortionDelta } from '../types'

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
  return [Math.random() * speed, Math.random() * speed, Math.random() * speed]
}

export const restrainVectorWithinRange = (vector: Vector, range: number): void => {
  if (vector.mag() > range) {
    vector.setMag(range)
  }
}
