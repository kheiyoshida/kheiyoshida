import { GeometrySpec, Vector3D } from '../types'

function cross(a: Vector3D, b: Vector3D): Vector3D {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

function normalize(v: Vector3D): Vector3D {
  const len = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / len, v[1] / len, v[2] / len]
}

/**
 * Recomputes vertex normals by averaging face normals.
 */
export function recomputeNormals(input: GeometrySpec): GeometrySpec {
  const vertexNormals: Vector3D[] = input.vertices.map(() => [0, 0, 0])

  for (const face of input.faces) {
    const [i0, i1, i2] = face.vertexIndices
    const v0 = input.vertices[i0]
    const v1 = input.vertices[i1]
    const v2 = input.vertices[i2]
    const e1: Vector3D = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]]
    const e2: Vector3D = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]]
    const n = normalize(cross(e1, e2))
    for (const i of [i0, i1, i2]) {
      const vn = vertexNormals[i]
      vn[0] += n[0]
      vn[1] += n[1]
      vn[2] += n[2]
    }
  }

  const normals = vertexNormals.map(normalize)

  return {
    ...input,
    normals,
    meta: { ...input.meta, stage: 'final' },
  }
}
