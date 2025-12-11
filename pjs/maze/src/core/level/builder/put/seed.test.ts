import { seedCells } from './seed.ts'
import { MazeGrid } from '../../grid.ts'

describe(`${seedCells.name}`, () => {
  it(`should put nodes in the grid randomly to satisfy given percentage of filled cells`, () => {
    const size = 9 // 5 x 5
    const grid = new MazeGrid(size, size)

    const fillRate = 0.2
    seedCells(grid, fillRate)

    expect(grid.sizeX).toBe(size)

    const actualFloorSize = 5
    expect(grid.count()).toBe(actualFloorSize * actualFloorSize * fillRate)

    // should be placed at even numbered positions
    for (let i = 0; i < grid.sizeX; i++) {
      for (let j = 0; j < grid.sizeY; j++) {
        if (i % 2 !== 0 || j % 2 !== 0) {
          expect(grid.get({ x: i, y: j })).toBeNull()
        }
      }
    }
  })
})
