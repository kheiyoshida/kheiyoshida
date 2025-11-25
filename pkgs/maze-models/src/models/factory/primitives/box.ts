import { GeometrySpec } from 'maze-gl'

export const boxSpec: GeometrySpec = {
  vertices: [
    [1, 1, -1],
    [1, -1, -1],
    [1, 1, 1],
    [1, -1, 1],
    [-1, 1, -1],
    [-1, -1, -1],
    [-1, 1, 1],
    [-1, -1, 1],
  ],
  normals: [
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, -1],
  ],
  faces: [
    {
      vertexIndices: [0, 4, 6],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [0, 6, 2],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [3, 2, 6],
      normalIndices: [1, 1, 1],
    },
    {
      vertexIndices: [3, 6, 7],
      normalIndices: [1, 1, 1],
    },
    {
      vertexIndices: [7, 6, 4],
      normalIndices: [2, 2, 2],
    },
    {
      vertexIndices: [7, 4, 5],
      normalIndices: [2, 2, 2],
    },
    {
      vertexIndices: [5, 1, 3],
      normalIndices: [3, 3, 3],
    },
    {
      vertexIndices: [5, 3, 7],
      normalIndices: [3, 3, 3],
    },
    {
      vertexIndices: [1, 0, 2],
      normalIndices: [4, 4, 4],
    },
    {
      vertexIndices: [1, 2, 3],
      normalIndices: [4, 4, 4],
    },
    {
      vertexIndices: [5, 4, 0],
      normalIndices: [5, 5, 5],
    },
    {
      vertexIndices: [5, 0, 1],
      normalIndices: [5, 5, 5],
    },
  ],
}

export const stairBoxSpec: GeometrySpec = {
  vertices: [
    [1, 1, 0.5],
    [1, -1, -1],
    [1, 1, 1],
    [1, -1, 1],
    [-1, 1, 0.5],
    [-1, -1, -1],
    [-1, 1, 1],
    [-1, -1, 1],
  ],
  normals: [
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, -1],
  ],
  faces: [
    {
      vertexIndices: [0, 4, 6],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [0, 6, 2],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [3, 2, 6],
      normalIndices: [1, 1, 1],
    },
    {
      vertexIndices: [3, 6, 7],
      normalIndices: [1, 1, 1],
    },
    {
      vertexIndices: [7, 6, 4],
      normalIndices: [2, 2, 2],
    },
    {
      vertexIndices: [7, 4, 5],
      normalIndices: [2, 2, 2],
    },
    {
      vertexIndices: [5, 1, 3],
      normalIndices: [3, 3, 3],
    },
    {
      vertexIndices: [5, 3, 7],
      normalIndices: [3, 3, 3],
    },
    {
      vertexIndices: [1, 0, 2],
      normalIndices: [4, 4, 4],
    },
    {
      vertexIndices: [1, 2, 3],
      normalIndices: [4, 4, 4],
    },
    {
      vertexIndices: [5, 4, 0],
      normalIndices: [5, 5, 5],
    },
    {
      vertexIndices: [5, 0, 1],
      normalIndices: [5, 5, 5],
    },
  ],
}
