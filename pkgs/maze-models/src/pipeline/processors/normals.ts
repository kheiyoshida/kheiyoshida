import { GeometrySpec, Vector3D } from '../types'
import { getNormal } from './triangulation'

/**
 * Recomputes vertex normals
 */
export function recomputeNormals(input: GeometrySpec): GeometrySpec {
  const vertexNormals: Vector3D[] = []

  for (const face of input.faces) {
    const [i0, i1, i2] = face.vertexIndices

    const v0 = input.vertices[i0]
    const v1 = input.vertices[i1]
    const v2 = input.vertices[i2]

    const normal = getNormal([v0, v1, v2])

    vertexNormals.push(normal)

    const ni = vertexNormals.length - 1
    face.normalIndices = [ni, ni, ni]
  }

  return {
    ...input,
    normals: vertexNormals,
    meta: { ...input.meta, stage: 'final' },
  }
}
