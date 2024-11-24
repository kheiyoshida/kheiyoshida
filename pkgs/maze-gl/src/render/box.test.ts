import { computeOutwardNormals } from './box'
import { DeformedBox, DeformedBoxNormals } from '../models'
import { mix, Vector3D } from '../vector'

describe(`${computeOutwardNormals.name}`, () => {
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

      const NFrontBottom = mix(normals.normalFBL, normals.normalFBR, x)
      const NBackBottom = mix(normals.normalBBL, normals.normalBBR, x)
      const NFrontTop = mix(normals.normalFTL, normals.normalFTR, x)
      const NBackTop = mix(normals.normalBTL, normals.normalBTR, x)

      const NBottom = mix(NBackBottom, NFrontBottom, z)
      const NFront = mix(NBackTop, NFrontTop, z)

      return mix(NBottom, NFront, y)
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
