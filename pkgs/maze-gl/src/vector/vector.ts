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

// We use normal array instead of Float32Array
glMatrix.setMatrixArrayType(Array)

/**
 * creates a new vector tuple for the sum of given 2 vectors
 */
export const sum = (v1: Vector3D, v2: Vector3D): Vector3D => {
  return vec3.add(vec3.create(), v1, v2) as Vector3D
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
 * creates a vector with three 0s
 */
export const create = (fill?: number): Vector3D => {
  if (!fill) return vec3.create() as Vector3D
  else return vec3.fromValues(fill, fill, fill) as Vector3D
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
    a[0] * ratio + b[0] * (1 - ratio),
    a[1] * ratio + b[1] * (1 - ratio),
    a[2] * ratio + b[2] * (1 - ratio),
  ]
}
