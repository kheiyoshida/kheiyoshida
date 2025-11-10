import { get2dProjection, getNormal, triangulateFace, triangulateFaces } from './triangulation'
import { GeometrySpec, Vector3D } from '../types'

describe(`${triangulateFaces.name}`, () => {
  it(`should divide the face with many vertices into triangle faces with just three vertices`, () => {
    const spec: GeometrySpec = {
      vertices: [
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
        [0.5, 0.3, 0], // in the right bottom triangle
        [0.2, 0.8, 0], // in the left top triangle
      ],
      normals: [[0, 0, 1]],
      faces: [
        {
          vertexIndices: [0, 1, 2, 4],
          normalIndices: [0, 0, 0, 0],
        },
        {
          vertexIndices: [0, 2, 3, 5],
          normalIndices: [0, 0, 0, 0],
        },
      ],
    }

    const result = triangulateFaces(spec)

    expect(result.faces).toHaveLength(6) // 3 triangles for each face

    const visited = []
    for(const face of result.faces) {
      expect(face.vertexIndices).toHaveLength(3)
      expect(face.normalIndices).toHaveLength(3)
      visited.push(...face.vertexIndices)
    }

    // every vertex should be used at least once
    for (let i = 0; i < spec.vertices.length; i++) {
      expect(visited.includes(i)).toBe(true)
    }

    // each triangle's winding order is CCW (gl default)
    for (const face of result.faces) {
      const normal = result.normals[face.normalIndices[0]]
      const [v0, v1, v2] = face.vertexIndices.map((idx) => spec.vertices[idx])
      const computedNormal = getNormal([v0, v1, v2])
      computedNormal.forEach((v, i) => expect(v).toBeCloseTo(normal[i]))
    }
  })

  test(`${triangulateFace.name}`, () => {
    const vertices: Vector3D[] = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],

      // interior points inserted by tesselation
      [0.5, 0.3, 0],
      [0.8, 0.1, 0],
    ]
    const normal: Vector3D = [0, 0, 1]

    const triangleList = triangulateFace(vertices, normal)

    triangleList.forEach((triangle) => expect(triangle).toHaveLength(3))

    // the number of triangles should be dependent on the number of vertices on the boundary of convex hull
    const totalVertices = vertices.length
    const boundaryVertices = 3
    expect(triangleList).toHaveLength(2 * totalVertices - 2 - boundaryVertices)

    // every vertex should be used at least once
    for (let i = 0; i < vertices.length; i++) {
      expect(triangleList.flat().find((idx) => idx === i)).not.toBeUndefined()
    }
  })

  test(`${get2dProjection.name}`, () => {
    const y = 3
    const vertices: Vector3D[] = [
      [-1, 3, 1],
      [1, 3, 1],
      [-1, 3, -1],
      [1, 3, -1],
      [-0.2, 3, -0.3],
      [0.3, 3, -0.8],
    ] // y = 3 face
    const normal: Vector3D = [0, 1, 0]

    const result = get2dProjection(vertices, normal)
    result.forEach((v2d) => {
      expect(v2d.includes(y)).toBe(false)
      expect(v2d).toHaveLength(2)
    })
  })

  test(`${getNormal.name}`, () => {
    const p1: Vector3D = [-1, 0, 0]
    const p2: Vector3D = [0, 1, 0]
    const p3: Vector3D = [1, 0, 0]
    expect(getNormal([p1, p2, p3])).toEqual([0, 0, -1])
  })
})
