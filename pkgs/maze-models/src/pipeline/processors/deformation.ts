import { GeometrySpec, Vector3D } from '../types'

export type DeformVertex = (vertex: Vector3D) => Vector3D

export const deformGeometry =
  (modify: DeformVertex) =>
  (input: GeometrySpec): GeometrySpec => {
    const vertices = input.vertices.map(modify)
    return { ...input, vertices }
  }

export const randomiseVertex = (val: number): DeformVertex => (v) => [
  v[0] + (Math.random() - 0.5) * val,
  v[1] + (Math.random() - 0.5) * val,
  v[2] + (Math.random() - 0.5) * val,
]

export const randomiseVertexWithPreserveY = (val: number, preserveY: number): DeformVertex => (v) => [
  v[0] + (Math.random() - 0.5) * val,
  v[1],
  v[2] + (Math.random() - 0.5) * val,
]
