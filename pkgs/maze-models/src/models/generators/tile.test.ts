import { generateTileGeometry, TileParams } from './tile'

describe(`${generateTileGeometry.name}`, () => {
  it(`should generate a tile with thickness`, () => {
    const geo = generateTileGeometry({
      radiusBase: 1,
      radiusDelta: 0,
      numOfCorners: 4,
      thicknessBase: 0.1,
      thicknessDelta: 0,
    })

    expect(geo.vertices).toHaveLength(10) // top 5 + bottom 5
    expect(geo.faces).toHaveLength(16) // top 4 + bottom 4 + side 8

    for (const [x, y, z] of geo.vertices) {
      if (x === 0 && z === 0) continue
      expect(Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2))).toBeCloseTo(1) // radius
      expect(y === 1 || y === 0.9).toBeTruthy()
    }
  })

  it(`can distort the shape by setting random delta values`, () => {
    const params: TileParams = {
      radiusBase: 2,
      radiusDelta: 0.5,
      numOfCorners: 4,
      thicknessBase: 0.3,
      thicknessDelta: 0.1,
    }
    const geo = generateTileGeometry(params)

    expect(geo.vertices).toHaveLength(10) // top 5 + bottom 5
    expect(geo.faces).toHaveLength(16) // top 4 + bottom 4 + side 8

    for (const [x, y, z] of geo.vertices) {
      if (x === 0 && z === 0) continue
      const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2))
      expect(radius).not.toEqual(params.radiusBase)
      expect(Math.abs(radius - params.radiusBase)).toBeLessThanOrEqual(params.radiusDelta)
      if (y !== 1) {
        const baseY = 1.0 - params.thicknessBase
        expect(y).not.toEqual(baseY)
        expect(Math.abs(y - baseY)).toBeLessThanOrEqual(params.thicknessDelta)
      }
    }
  })
})
