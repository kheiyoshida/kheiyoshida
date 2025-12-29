import { calcFaceNormal, calcFaceNormalsOfBox, computeOutwardNormals, blendBoxNormalsForAVertex } from './box'
import { DeformedBox, DeformedBoxNormals, DeformedBoxNormalsV2 } from '../models'
import { Vector3D, Vec3 } from '../models/supporting/vector'

const deformedBox: DeformedBox = {
  FBL: [-1, -1, 1],
  FBR: [1, -1, 1],
  FTL: [-1, 1, 1],
  FTR: [1, 1, 1],
  BBL: [-1, -1, -1],
  BBR: [1, -1, -1],
  BTL: [-1, 1, -1],
  BTR: [1, 1, -1],
}

describe(`${computeOutwardNormals.name}`, () => {
  it(`should calculate the normals that point from the center of the box to each vertex`, () => {
    const result = computeOutwardNormals(deformedBox)

    const expected: DeformedBoxNormals = {
      normalFBL: [-1, -1, 1],
      normalFBR: [1, -1, 1],
      normalFTL: [-1, 1, 1],
      normalFTR: [1, 1, 1],
      normalBBL: [-1, -1, -1],
      normalBBR: [1, -1, -1],
      normalBTL: [-1, 1, -1],
      normalBTR: [1, 1, -1],
    }
    expect(result).toEqual(expected)
  })

  // not about the function itself, but we use this logic in GLSL
  it(`can be used to interpolate normal`, () => {
    const trilinearInterpolateNormal = (point: Vector3D, normals: DeformedBoxNormals) => {
      const [x, y, z] = point

      const NFrontBottom = Vec3.mix(normals.normalFBL, normals.normalFBR, x)
      const NBackBottom = Vec3.mix(normals.normalBBL, normals.normalBBR, x)
      const NFrontTop = Vec3.mix(normals.normalFTL, normals.normalFTR, x)
      const NBackTop = Vec3.mix(normals.normalBTL, normals.normalBTR, x)

      const NBottom = Vec3.mix(NBackBottom, NFrontBottom, z)
      const NTop = Vec3.mix(NBackTop, NFrontTop, z)

      return Vec3.mix(NBottom, NTop, y)
    }
    const normalisePosition = (p: Vector3D): Vector3D => [
      (p[0] + 1.0) / 2,
      (p[1] + 1.0) / 2,
      (p[2] + 1.0) / 2,
    ]

    const outwardNormals = computeOutwardNormals(deformedBox)

    const normalisedPosition = normalisePosition(deformedBox.FTR)
    const interpolatedNormal = trilinearInterpolateNormal(normalisedPosition, outwardNormals)

    expect([interpolatedNormal[0], interpolatedNormal[1], interpolatedNormal[2]]).toEqual(
      outwardNormals.normalFTR
    )
  })
})

describe(`${calcFaceNormal.name}`, () => {
  it(`calculates face normal for 4 vertices face`, () => {
    const expected: Vector3D = [0, 0, 4]
    const normal = calcFaceNormal(
      // points in face in counterclockwise order
      deformedBox.FBR,
      deformedBox.FTR,
      deformedBox.FTL,
      deformedBox.FBL
    )
    expect(normal).toEqual(expected)
  })
  it(`calculates face normal for 3 vertices face`, () => {
    const expected: Vector3D = [0, -0, 4]
    const normal = calcFaceNormal(deformedBox.FBR, deformedBox.FTR, deformedBox.FTL)
    expect(normal).toEqual(expected)
  })
  it(`blends the 2 triangle's normals`, () => {
    const normal = calcFaceNormal(
      deformedBox.FBR,
      deformedBox.FTR,
      deformedBox.FTL,
      [-1, -1, 0.5] // disposition-ed FBL
    )
    expect(normal).not.toEqual([0, -0, 4])
    expect(normal).toEqual([-0.5, -0.5, 4])
  })
})

describe(`${calcFaceNormalsOfBox.name}`, () => {
  it(`calculates face normals for 6 faces of the given box`, () => {
    const expected: DeformedBoxNormalsV2 = {
      normalFront: [0, 0, 4],
      normalBack: [0, 0, -4],
      normalLeft: [-4, 0, 0],
      normalRight: [4, 0, 0],
      normalBottom: [0, -4, 0],
      normalTop: [0, 4, 0],
    }
    const result = calcFaceNormalsOfBox(deformedBox)
    expect(result).toEqual(expected)
  })
})

describe(`${blendBoxNormalsForAVertex.name}`, () => {
  it(`should return the vertex's closest face's normal`, () => {
    const boxNormals = calcFaceNormalsOfBox(deformedBox)
    const vertex: Vector3D = [0.0, 0.99999, 0.0] // close to top
    const result = blendBoxNormalsForAVertex(vertex, deformedBox, boxNormals)

    expect(result[0]).toBeCloseTo(0)
    expect(result[1]).toBeCloseTo(1)
    expect(result[2]).toBeCloseTo(0)
  })
  it.only(`should return the vertex's closest face's normal (double check)`, () => {
    const boxNormals = calcFaceNormalsOfBox(deformedBox)
    const vertex: Vector3D = [-0.999, 0.0, 0.0] // close to left
    const result = blendBoxNormalsForAVertex(vertex, deformedBox, boxNormals)

    expect(result[0]).toBeCloseTo(-1)
    expect(result[1]).toBeCloseTo(0)
    expect(result[2]).toBeCloseTo(0)
  })
  it(`should blend the result if vertex is equally close to multiple faces`, () => {
    const boxNormals = calcFaceNormalsOfBox(deformedBox)
    const vertex: Vector3D = [0.9999, 0.9999, 0.0] // close to top and right
    const result = blendBoxNormalsForAVertex(vertex, deformedBox, boxNormals)

    expect(result).toEqual(
      [
        0.7071067780278051,
        0.7071067780278051,
        0.00009452128110086504,
      ]
    )
  })
})
