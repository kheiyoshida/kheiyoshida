import { GeometrySpec } from '../../pipeline/types'

export const rectangle: GeometrySpec = {
  vertices: [
    [-1, -1,-1],
    [1, -1, -1],
    [1, 1,  -1],
    [-1, 1, -1],
  ],
  normals: [[0, 0, 1]],
  faces: [
    {
      vertexIndices: [0, 1, 2],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [0, 2, 3],
      normalIndices: [0, 0, 0],
    },
  ],
}
