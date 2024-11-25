/**
 * wrapper functions for gl-matrix vec3 operations
 *
 * implement more functions as we go
 *
 * gl-matrix's original documentation & implementation can be found here:
 * https://glmatrix.net/docs/module-vec3.html
 */

import { glMatrix, vec3 } from 'gl-matrix'
import { Vector3D } from './types'
import { randomFloatBetween } from 'utils'

// We use normal array instead of Float32Array
glMatrix.setMatrixArrayType(Array)

/**
 * creates a new vector for the sum of given 2 vectors
 */
export const sum2 = (v1: Vector3D, v2: Vector3D): Vector3D => {
  return vec3.add(vec3.create(), v1, v2) as Vector3D
}

/**
 * create a new vector for the sum of given multiple vectors of arbitrary number.
 *
 * use `sum2` when summing up 2 vectors
 */
export const sum = (...vectors: Vector3D[]): Vector3D => {
  const result = vec3.create()
  for (let i = 0; i < vectors.length; i++) {
    vec3.add(result, result, vectors[i])
  }
  return result as Vector3D
}

/**
 * creates a new vector by subtraction (left - right)
 */
export const sub = (left: Vector3D, right: Vector3D): Vector3D => {
  return vec3.sub(vec3.create(), left, right) as Vector3D
}

/**
 * add a vector to another vector
 * note that it mutates the vector
 */
export const add = (target: Vector3D, delta: Vector3D): void => {
  vec3.add(target, target, delta)
}

/**
 * create a vector with three 0s
 */
export const create = (fill?: number): Vector3D => {
  if (!fill) return vec3.create() as Vector3D
  else return vec3.fromValues(fill, fill, fill) as Vector3D
}

/**
 * create a vector using given callback to decide values to put in
 */
export const build = (valueCallBack: (index: number) => number): Vector3D => {
  return [...Array(3)].map((_, i) => valueCallBack(i)) as Vector3D
}

/**
 * Scales a vec3 by a scalar number
 */
export const scale = (v: Vector3D, amount: number): void => {
  vec3.scale(v, v, amount)
}

/**
 * creates a mix of vectors applying the given ratio
 * same operation as GLSL's mix() function
 * @param a
 * @param b
 * @param ratio float between 0 and 1
 */
export const mix = (a: Vector3D, b: Vector3D, ratio: number): Vector3D => {
  return [
    a[0] * (1 - ratio) + b[0] * ratio,
    a[1] * (1 - ratio) + b[1] * ratio,
    a[2] * (1 - ratio) + b[2] * ratio,
  ]
}

/**
 * creates a new vector that represents the average of given vectors
 */
export const avg = (...vectors: Vector3D[]): Vector3D => {
  const s = sum(...vectors)
  return [s[0] / vectors.length, s[1] / vectors.length, s[2] / vectors.length]
}

/**
 * create a vector with random values within the given range
 */
export const random = (min = -1, max = 1): Vector3D => {
  return build(() => randomFloatBetween(min, max))
}

/**
 * get the "length" of the given vector
 */
export const mag = (v: Vector3D): number => {
  return Math.hypot(v[0], v[1], v[2])
}

/**
 * normalize a vector to an arbitrary length
 */
export const normalize = (v: Vector3D, length: number): void => {
  const magnitude = mag(v)
  if (magnitude === 0) {
    throw new Error('Cannot normalize a zero vector.')
  }
  const scale = length / magnitude
  v[0] *= scale
  v[1] *= scale
  v[2] *= scale
}
