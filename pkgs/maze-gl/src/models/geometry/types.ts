import { Vector3D } from '../../vector'

export type GeometrySpec = {
  vertices: Vector3D[]
  normals: Vector3D[]
  faces: TriangleIndexData[]
}

/**
 * unsigned int index
 */
export type Index = number

export type TriangleIndexData = {
  vertexIndices: Index[]
  normalIndices: Index[]
}
