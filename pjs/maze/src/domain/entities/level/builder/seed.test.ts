import { seedNodes } from './seed.ts'
import { initGrid } from './init.ts'

describe(`${seedNodes.name}`, () => {
  it(`should put nodes in the grid randomly to satisfy given percentage of filled cells`, () => {
    const size = 10
    const grid = initGrid(size)

    const fillRate = 0.2
    seedNodes(grid, fillRate)

    expect(grid.sizeX).toBe(size * 2 - 1)
    expect(grid.count()).toBe(size * size * fillRate)

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
