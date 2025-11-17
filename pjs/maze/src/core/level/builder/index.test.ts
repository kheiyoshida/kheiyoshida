import { buildMazeGrid } from './index.ts'

describe(`${buildMazeGrid.name}`, () => {
  it(`should generate a maze with one stair in it`, () => {
    const grid = buildMazeGrid({
      size: 7,
      fillRate: 0.5,
      connRate: 0.3,
      startPositionConstraint: 'shouldFaceCorridorWall',
      stairPositionConstraint: 'deadEnd',
    })
    expect(grid.filter((cell) => cell.type === 'stair')).toHaveLength(1)
  })
})
