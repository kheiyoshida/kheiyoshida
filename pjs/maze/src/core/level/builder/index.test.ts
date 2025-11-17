import { buildMazeGrid } from './index.ts'

describe(`${buildMazeGrid.name}`, () => {
  it(`should generate a maze with one stair at a dead end position and one start cell with wall facing direction`, () => {
    const grid = buildMazeGrid({
      size: 7,
      fillRate: 0.5,
      connRate: 0.3,
      startPositionConstraint: 'shouldFaceCorridorWall',
      stairPositionConstraint: 'deadEnd',
    })

    const stairCell = grid.filterItems((cell) => cell.type === 'stair')[0]
    expect(stairCell).toBeDefined()
    expect(grid.getDeadEnds().filter((pos) => grid.get(pos) === stairCell).length).toBe(1)

    const startCellPos = grid.findPosition((pos, item) => item !== null && item.start !== undefined)!
    expect(startCellPos).toBeDefined()
    expect(grid.getCorridors().filter((pos) => pos.x == startCellPos.x && pos.y == startCellPos.y)).toHaveLength(1)
  })
})
