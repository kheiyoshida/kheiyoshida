import { MazeGrid } from './grid.ts'
import { makeTestGrid, visualizeGrid } from '../../../__test__/grid/visualise.ts'

describe(`${MazeGrid.name}`, () => {
  it(`can connect adjacent cells`, () => {
    const grid = new MazeGrid(5, 5)

    const path = grid.connect({ x: 0, y: 0 }, { x: 2, y: 4 })

    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
    ])

    expect(visualizeGrid(grid)).toMatchInlineSnapshot(`
      "
      1 0 0 0 0 
      1 0 0 0 0 
      1 0 0 0 0 
      1 0 0 0 0 
      1 1 1 0 0 "
    `)
  })

  it(`can detect dead ends`, () => {
    const grid = makeTestGrid([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 1],
      [0, 0, 1, 1, 1],
    ])

    expect(grid.getDeadEnds()).toEqual([
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ])
  })

  it(`can detect corridors`, () => {
    const grid = makeTestGrid([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 1],
      [0, 0, 1, 1, 1],
    ])

    expect(grid.getCorridors()).toEqual([
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
    ])
  })
})
