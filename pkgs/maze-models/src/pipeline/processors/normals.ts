import { GeometrySpec, Vector3D } from '../types'
import { getNormal } from './triangulation'
import * as Vec3 from 'maze-gl/src/vector/vector'

/**
 * Recomputes face normals and assign them to vertices
 */
export function recomputeFaceNormals(input: GeometrySpec): GeometrySpec {
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

/**
 * compute vertex normals by getting belonging triangles' normals
 */
export function computeVertexNormals(input: GeometrySpec): GeometrySpec {
  const normals = input.vertices.map(() => [0, 0, 0] as Vector3D)

  for (const face of input.faces) {
    const faceNormal = input.normals[face.normalIndices[0]] // same for all vertices

    for (let i = 0; i < 3; i++) {
      const vIndex = face.vertexIndices[i]
      normals[vIndex] = Vec3.sum2(normals[vIndex], faceNormal)
      face.normalIndices[i] = vIndex
    }
  }

  normals.forEach((n) => Vec3.normalize(n, 1))

  return {
    ...input,
    normals,
  }
}
