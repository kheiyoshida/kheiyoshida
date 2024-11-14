export type GeometrySpec = {
  vertices: Vector[]
  normals: Vector[]
  faces: TriangleIndexData[]
}

export type Vector = [number, number, number]
// export type UV = [number, number]

/**
 * unsigned int index
 */
export type Index = number

export type TriangleIndexData = {
  vertexIndices: Index[]
  normalIndices: Index[]
  // uvIndices: Index[]
}
