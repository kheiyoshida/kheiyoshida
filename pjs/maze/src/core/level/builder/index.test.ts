import { buildMazeGrid } from './index.ts'

describe(`${buildMazeGrid.name}`, () => {
  it(`should generate a maze with one stair in it`, () => {
    const grid = buildMazeGrid([7, 0.5, 0.3])
    expect(grid.filter((cell) => cell.type === 'stair')).toHaveLength(1)
  })
})
