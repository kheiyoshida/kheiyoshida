import { buildMaze } from '.'

describe(`director`, () => {
  it(`should build matrix and other info for a maze`, () => {
    const result = buildMaze(1)
    expect(typeof result.initialDir).toBe('string')
    expect(result.initialPos).toHaveLength(2)
    expect(result.stairPos).toHaveLength(2)
    expect(result.matrix).toHaveLength(6)
    expect(result.matrix[0]).toHaveLength(6)
  })
})
