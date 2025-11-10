import { describe } from 'node:test'
import { recomputeNormals } from './normals'
import { GeometrySpec } from '../types'
import { getNormal } from './triangulation'

describe(`${recomputeNormals.name}`, () => {
  it(`should recompute normals for each triangle`, () => {
    const spec: GeometrySpec = {
      vertices: [
        [0, 0, 0],
        [1, 0, -1], // say it has been deformed
        [2, 0, 0],
        [1, 1, 0],
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

    const result = recomputeNormals(spec)

    for (const face of result.faces) {
      const normal = getNormal(face.vertexIndices.map((idx) => result.vertices[idx]))
      for (const ni of face.normalIndices) {
        expect(result.normals[ni]).toEqual(normal)
      }
    }
  })
})
