import { GeometrySpec, Vector3D } from '../types'
import { randomFloatBetween } from 'utils'

export type DeformVertex = (vertex: Vector3D) => Vector3D

export const deformGeometry =
  (modify: DeformVertex) =>
  (input: GeometrySpec): GeometrySpec => {
    const vertices = input.vertices.map(modify)
    return { ...input, vertices }
  }

export const randomise = (distortion: number) => deformGeometry(randomiseVertex(distortion))
export const randomiseHorizontally = (distortion: number) => deformGeometry(randomiseVertex(distortion, true))
export const randomiseWithinRange = (min: number, max: number, preserveY = false) =>
  deformGeometry(randomiseVertexWithinRange(min, max, preserveY))

/// deform vertex ///

export const randomiseVertex =
  (distortion: number, preserveY = false): DeformVertex =>
  (v) => [
    v[0] + (Math.random() - 0.5) * distortion,
    v[1] + (Math.random() - 0.5) * distortion * (preserveY ? 0.1 : 1),
    v[2] + (Math.random() - 0.5) * distortion,
  ]

export const randomiseVertexWithinRange =
  (min: number, max: number, preserveY = false): DeformVertex =>
  (v) => [
    v[0] * randomFloatBetween(min, max),
    v[1] * (preserveY ? 1 : randomFloatBetween(min, max)),
    v[2] * randomFloatBetween(min, max),
  ]

export const skipCorners =
  (deform: DeformVertex): DeformVertex =>
  (v) =>
    (v[0] === 1 || v[0] === -1) && (v[1] === 1 || v[1] === -1) && (v[2] === 1 || v[2] === -1) ? v : deform(v)

export const skipTopFace = (deform: DeformVertex): DeformVertex => (v) => (v[1] === 1 ? v : deform(v))
