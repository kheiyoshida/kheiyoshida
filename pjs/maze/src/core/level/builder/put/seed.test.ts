import { seedCells, seedOuterCells } from './seed.ts'
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

  it(`should avoid putting cells on the outer circle if exit flag is given`, () => {
    const size = 11 // 6 x 6
    const grid = new MazeGrid(size, size)

    const fillRate = 0.25
    seedCells(grid, fillRate, true) // avoiding outer circle, only inner 4x4 is available

    const availableFloorSize = 4 * 4
    expect(grid.count()).toBe(availableFloorSize * fillRate)

    for (const x of [0, 10]) {
      for (const y of [0, 10]) {
        expect(grid.get({ x, y })).toBeNull()
      }
    }

    seedOuterCells(grid, 2)
    let outerCount = 0
    for (const x of [0, 10]) {
      for (const y of [0, 10]) {
        if (grid.get({ x, y }) !== null) outerCount++
      }
    }
    expect(outerCount).toBe(2)

    // everything should be placed at even numbered position
    for (let i = 0; i < grid.sizeX; i++) {
      for (let j = 0; j < grid.sizeY; j++) {
        if (i % 2 !== 0 || j % 2 !== 0) {
          expect(grid.get({ x: i, y: j })).toBeNull()
        }
      }
    }
  })
})
