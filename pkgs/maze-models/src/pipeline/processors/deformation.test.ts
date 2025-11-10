import { deformGeometry } from './deformation'
import { GeometrySpec } from '../types'

describe(`${deformGeometry.name}`, () => {
  it(`can deform geometry by modifying vertices based on given rules`, () => {
    const spec: GeometrySpec = {
      vertices: [
        [-1, 1, 1],
        [1, 1, 1],
        [-1, 1, -1],
        [1, 1, -1],
      ],
      normals: [[0, 1, 0]],
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

    const result = deformGeometry((v) => [v[0], v[1] - 1, v[2]])(spec)

    result.vertices.forEach(v => expect(v[1]).toBe(0))
  })
})
