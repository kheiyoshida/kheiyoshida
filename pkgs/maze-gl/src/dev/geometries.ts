import { DeformedBox, GeometrySpec } from '../models'

export const triangleSpec: GeometrySpec = {
  faces: [
    {
      vertexIndices: [0, 1, 2],
      normalIndices: [0, 1, 2],
    },
  ],
  normals: [
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
  ],
  vertices: [
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, -1.0, 0.0],
  ],
}

export const triangleSpec2: GeometrySpec = {
  faces: [
    {
      vertexIndices: [0, 1, 2],
      normalIndices: [0, 1, 2],
    },
  ],
  normals: [
    [1.0, 0.0, 0.0],
    [-1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
  ],
  vertices: [
    [1.0, 0.0, 1.0],
    [-1.0, 0.0, 1.0],
    [0.0, 1.0, 1.0],
  ],
}

const testDeformedBox: DeformedBox = {
  FBL: [-1, -1, 1],
  FBR: [1, -1, 1],
  FTL: [-1, 1, 1],
  FTR: [1, 1, 1],
  BBL: [-1, -1, -1],
  BBR: [1, -1, -1],
  BTL: [-1, 1, -1],
  BTR: [1, 1, -1],
}

const boxSize = 1000
const halfBox = boxSize * 0.5

export const gameSizeDeformedBox = Object.fromEntries(
  Object.entries(testDeformedBox).map(([k, v]) => {
    return [k, v.map((n) => n * halfBox)]
  })
) as DeformedBox

export const gameSizeDeformedBox2 = Object.fromEntries(
  Object.entries(testDeformedBox).map(([k, v]) => {
    const scaled = v.map((n) => n * halfBox)
    return [k, [scaled[0] + boxSize, scaled[1], scaled[2]+ boxSize] ]
  })
) as DeformedBox

export const gameSizeDeformedBox3 = Object.fromEntries(
  Object.entries(testDeformedBox).map(([k, v]) => {
    const scaled = v.map((n) => n * halfBox)
    return [k, [scaled[0], scaled[1], scaled[2] - boxSize]]
  })
) as DeformedBox
