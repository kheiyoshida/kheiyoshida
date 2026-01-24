import { randomPointOnFace, tesselateGeometry } from './tessellation'
import { GeometrySpec } from '../types'

describe(`${tesselateGeometry.name}`, () => {
  it(`should insert random vertices on each face, not outside it`, () => {
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

    const numOfInsertions = 2
    const result = tesselateGeometry(numOfInsertions)(spec)
    expect(result.vertices.length).toBe(spec.vertices.length + spec.faces.length * numOfInsertions)
    for (const face of result.faces) {
      expect(face.vertexIndices).toHaveLength(3 + numOfInsertions)
      expect(face.normalIndices).toHaveLength(3 + numOfInsertions)
    }
  })

  test(`${randomPointOnFace.name}`, () => {
    for (let i = 0; i < 100; i++) {
      const result = randomPointOnFace(
        [0, 0, 0],
        [2, 0, 0],
        [0, 2, 0],
      )

      // just a quick check - prob should check with SAT algorithm if in doubt
      const [x, y, z] = result
      expect(x + y).toBeLessThan(2)
      expect(z).toBe(0)
    }
  })
})
