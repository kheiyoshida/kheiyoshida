import { computeVertexNormals, recomputeFaceNormals } from './normals'
import { GeometrySpec, Vector3D } from '../types'
import { getNormal } from './triangulation'
import { normalize } from 'maze-gl/src/vector/vector'

describe(`${recomputeFaceNormals.name}`, () => {
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

    const result = recomputeFaceNormals(spec)

    for (const face of result.faces) {
      const normal = getNormal(face.vertexIndices.map((idx) => result.vertices[idx]))
      for (const ni of face.normalIndices) {
        expect(result.normals[ni]).toEqual(normal)
      }
    }
  })
})

describe(`${computeVertexNormals.name}`, () => {
  it(`should compute vertex normals and assign them`, () => {
    const n1: Vector3D = [0, 0, 1]
    const n2: Vector3D = [1, 1, -1]
    const n3: Vector3D = [-1, 0, 0]
    const n4: Vector3D = [0, -1, 0]

    // tetrahedron formed around axes
    const spec: GeometrySpec = {
      vertices: [
        [0, 0, 0], // A
        [1, 0, 0], // B
        [0, 0, -1], // C
        [0, 0, 1], // D
      ],
      normals: [n1, n2, n3, n4],
      faces: [
        {
          // ABD
          vertexIndices: [0, 1, 3],
          normalIndices: [0, 0, 0],
        },
        {
          // DBC
          vertexIndices: [3, 1, 2],
          normalIndices: [1, 1, 1],
        },
        {
          // DCA
          vertexIndices: [3, 2, 0],
          normalIndices: [2, 2, 2],
        },
        {
          // ABC
          vertexIndices: [0, 1, 2],
          normalIndices: [3, 3, 3],
        },
      ],
    }

    const result = computeVertexNormals(spec)

    // now each vertex has different normal on each face
    for (const face of result.faces) {
      expect(new Set(face.normalIndices).size).toBe(3)

      for (let i = 0; i < 3; i++) {
        const vIndex = face.vertexIndices[i]
        const normal = result.normals[face.normalIndices[i]]

        if (vIndex === 0) {
          expect(normal).toEqual([-0.5773502691896258, -0.5773502691896258, 0.5773502691896258])
        }
      }
    }
  })
})
