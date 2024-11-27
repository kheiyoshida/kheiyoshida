import { DeformedBox, GeometrySpec } from '../models'
import { Vector3D } from '../vector'

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

export const boxSize = 1000
export const halfBox = boxSize * 0.5

export const getDeformedBox = (...disposition: Vector3D) => {
  return Object.fromEntries(
    Object.entries(testDeformedBox).map(([k, v]) => {
      const scaled = v.map((n) => n * halfBox)
      return [k, [scaled[0] + disposition[0], scaled[1] + disposition[1], scaled[2] + disposition[2]]]
    })
  ) as DeformedBox
}
