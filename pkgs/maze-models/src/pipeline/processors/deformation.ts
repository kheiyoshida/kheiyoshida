import { GeometrySpec, Vector3D } from '../types'

export const deformGeometry =
  (modify: (vertex: Vector3D) => Vector3D) =>
  (input: GeometrySpec): GeometrySpec => {
    const vertices = input.vertices.map(modify)
    return { ...input, vertices }
  }
