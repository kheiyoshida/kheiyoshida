import { build } from '.'

describe(`director`, () => {
  it(`should build matrix and other info for a maze`, () => {
    const result = build(1)
    expect(typeof result.initialDir).toBe('string')
    expect(result.initialPos).toHaveLength(2)
    expect(result.stairPos).toHaveLength(2)
    expect(result.matrix).toHaveLength(6)
    expect(result.matrix[0]).toHaveLength(6)
  })
})

describe(`main construction steps`, () => {
  describe(`determineInitialPos`, () => {
    it.todo(`should determine initial position in a corridor node`)
  })
  describe(`setStair`, () => {
    it.todo(`should set stair node in matrix but it must be placed in deadend`)
  })
})
