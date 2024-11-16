import { mat4, vec3 } from 'gl-matrix'
import { Eye } from '../models'
import { toRadians } from '../utils/calc'
import { ndcScale, positionToNDC } from './scale'

const up = vec3.fromValues(0, 1, 0)

export const convertEyeValuesToMatrices = (eye: Eye): [view: mat4, projection: mat4] => {
  const ndcPosition = positionToNDC(eye.position)

  // get view matrix
  const direction = vec3.create()
  const yaw = toRadians(eye.direction)
  vec3.set(direction, Math.sin(yaw), 0, -Math.cos(yaw))

  const lookAtTarget = vec3.create()
  vec3.add(lookAtTarget, ndcPosition, direction)

  const view = mat4.create()
  mat4.lookAt(view, ndcPosition, lookAtTarget, up)

  // get projection matrix
  const projection = mat4.create()
  mat4.perspective(projection, eye.fov, eye.aspectRatio, 0.1, ndcScale(eye.sight))

  return [view, projection]
}
