import { build, buildMatrix } from '.'

describe(`director`, () => {
  it(`should build matrix and other info for a maze`, () => {
    const result = build(1)
    expect(typeof result.initialDir).toBe('string')
    expect(result.initialPos).toHaveLength(2)
    expect(result.stairPos).toHaveLength(2)
    expect(result.matrix).toHaveLength(7)
    expect(result.matrix[0]).toHaveLength(7)
  })
})

describe(`main construction steps`, () => {
  describe(`determineInitialPos`, () => {
    it(`should determine initial position in a corridor node`, () => {
      //
    })
  })
  describe(`setStair`, () => {
    it(`should set stair node in matrix but it must be placed in deadend`, () => {
      //
    })
  })
})

describe(`sub steps`, () => {})

describe(`newBuildMatrix`, () => {
  it(`can build`, () => {
    const result = buildMatrix(5, 0.5, 0.8)
    // expect(result).toMatchInlineSnapshot()
  })
})
