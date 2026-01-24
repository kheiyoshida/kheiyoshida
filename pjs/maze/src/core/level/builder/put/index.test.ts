import { putCellsWithExit } from './index.ts'
import { MazeGrid } from '../../grid.ts'
import { visualizeGridWithSymbols } from '../../../../__test__/grid/visualise.ts'
import { seedCells, seedOuterCells } from './seed.ts'
import { connectCells } from './connect.ts'

describe(`${putCellsWithExit.name}`, () => {
  it(`should produce a maze with exit pattern`, () => {
    const grid = new MazeGrid(11, 11)

    seedCells(grid, 0.5, true)
    // console.log(visualizeGridWithSymbols(grid))

    seedOuterCells(grid, 2)
    // console.log(visualizeGridWithSymbols(grid))

    connectCells(grid, 1.0)
    // console.log(visualizeGridWithSymbols(grid))
  })
})
