import { initGrid } from './init.ts'

describe(`${initGrid.name}`, () => {
  it(`should set the size so that the even numbered cells should form square`, () => {
    const grid = initGrid(3)
    expect(grid.sizeX).toBe(3 + 2) // floors + paths
    expect(grid.sizeY).toBe(grid.sizeX)

    const grid2 = initGrid(4)
    expect(grid2.sizeX).toBe(4 + 3)
    expect(grid2.sizeY).toBe(grid2.sizeX)
  })
})
