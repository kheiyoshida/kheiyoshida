import { cross, normalize, sub } from 'maze-gl/src/models/supporting/vector/vector'
import { GeometrySpec, Index, TriangleIndexData, Vector3D } from '../types'
import Delaunator from 'delaunator'

export type Vector2D = [x: number, y: number]

export type TriangleIndices = [i0: Index, i1: Index, i2: Index]

/**
 * Given vertices (possibly unordered within each face),
 * produces explicit triangles via triangulation.
 */
export function triangulateFaces(input: GeometrySpec): GeometrySpec {
  const newFaces: TriangleIndexData[] = []
  for (const face of input.faces) {
    const faceVertices = face.vertexIndices.map((i) => input.vertices[i])
    const normalIndex = face.normalIndices[0]
    const faceNormal = input.normals[normalIndex] // same for every vertex for now
    const localTriangles = triangulateFace(faceVertices, faceNormal)
    for (const triangle of localTriangles) {
      const globalIndices = triangle.map((i) => face.vertexIndices[i]) as TriangleIndices
      newFaces.push({
        vertexIndices: ensureWindingOrder(globalIndices, input.vertices, faceNormal),
        normalIndices: [normalIndex, normalIndex, normalIndex],
      })
    }
  }

  return {
    ...input,
    faces: newFaces,
    meta: { ...input.meta, stage: 'triangulated' },
  }
}

/**
 *
 * @param vertices vertices of a face in 3d space
 * @param faceNormal
 * @returns local indices of triangles in the face, need to be transformed back to global indices
 */
export function triangulateFace(vertices: Vector3D[], faceNormal: Vector3D): TriangleIndices[] {
  const projected = get2dProjection(vertices, faceNormal)
  const { triangles } = Delaunator.from(projected)
  if (triangles.length == 0) throw new Error('no triangles. is the normal correct?')

  const result: TriangleIndices[] = []
  for (let i = 0; i < triangles.length; i += 3) {
    result.push([triangles[i], triangles[i + 1], triangles[i + 2]])
  }
  return result
}

export function get2dProjection(vertices: Vector3D[], faceNormal: Vector3D): Vector2D[] {
  const absN = faceNormal.map(Math.abs)
  const drop =
    absN[0] > absN[1] && absN[0] > absN[2]
      ? 0 // drop X → use YZ plane
      : absN[1] > absN[2]
        ? 1 // drop Y → use XZ plane
        : 2 // drop Z → use XY plane
  return vertices.map((v) => dropDimension(v, drop))
}

function dropDimension(vertex: Vector3D, drop: number): Vector2D {
  return vertex.filter((_, i) => i !== drop) as Vector2D
}

/**
 * Ensures a triangle's winding order matches the given reference normal.
 * If the normal points opposite to the reference, it swaps the last two indices.
 *
 * @param tri The triangle's vertex indices (mutable)
 * @param vertices The vertex array in 3D
 * @param referenceNormal The face's intended normal
 * @returns The same triangle array, possibly reversed
 */
function ensureWindingOrder(
  tri: TriangleIndices,
  vertices: Vector3D[],
  referenceNormal: Vector3D
): TriangleIndices {
  const [i0, i1, i2] = tri
  const a = vertices[i0]
  const b = vertices[i1]
  const c = vertices[i2]

  const n: Vector3D = getNormal([a, b, c])

  // dot with reference normal
  const dot = n[0] * referenceNormal[0] + n[1] * referenceNormal[1] + n[2] * referenceNormal[2]

  // flip winding if facing opposite
  if (dot < 0) return [i0, i2, i1]
  return tri
}

export const getNormal = (triangle: Vector3D[]): Vector3D => {
  const [a, b, c] = triangle
  const normal = cross(sub(b, a), sub(c, a))
  normalize(normal, 1)
  return normal
}
