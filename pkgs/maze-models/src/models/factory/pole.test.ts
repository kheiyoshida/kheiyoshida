import { poleGeometryFactory, PoleGeometryParams } from './pole'

describe(`${poleGeometryFactory.name}`, () => {
  it(`should generate geometry`, () => {
    const params: PoleGeometryParams = {
      type: 'pole',
      radiusBase: 1,
      radiusDelta: 0,
      numOfCorners: 4,
      heightBase: 4,
      heightDelta: 0,
      heightPerSegment: 2,
      segmentYDelta: 0,
    }

    const geo = poleGeometryFactory(params)

    expect(geo.vertices).toHaveLength(14) // top (4 + 1) + middle 4 + bottom (4 + 1)
    expect(geo.faces).toHaveLength(24) // top circle 4 + 8 triangles for segment 1 and 2 + bottom circle 4

    for (const [x, y, z] of geo.vertices) {
      if (x === 0 && z === 0) continue
      expect(Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2))).toBeCloseTo(1) // radius
      expect(y === 3 || y === 1 || y === -1).toBeTruthy()
    }
  })
})
