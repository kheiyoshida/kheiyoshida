import { connectCells } from './connect.ts'
import { findPath } from '../path.ts'
import { makeTestGrid, visualizeGrid } from '../../../../__test__/grid/visualise.ts'
import { equals } from '../../utils/grid/position2d.ts'

describe(`${connectCells.name}`, () => {
  it(`should connect cells so that every cell is reachable from every other cell`, () => {
    const grid = makeTestGrid([
      [0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 1],
    ])

    connectCells(grid, 0.5)

    console.log(visualizeGrid(grid))

    grid.iterateItems((_, pos) => {
      grid.iterateItems((__, pos2) => {
        if (equals(pos, pos2)) return

        const path = findPath(grid, pos, pos2)
        expect(path).not.toBeNull()
      })
    })
  })
})
