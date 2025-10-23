import { findPath } from './path.ts'
import { makeTestGrid } from '../../../__test__/grid/visualise.ts'

describe(`${findPath.name}`, () => {
  it(`should find a path`, () => {
    const grid = makeTestGrid([
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 1],
      [0, 0, 1, 0, 1],
      [1, 1, 1, 0, 1],
    ])

    const path = findPath(grid, { x: 0, y: 4 }, { x: 4, y: 4 })
    expect(path).not.toBeNull()
    expect(path).toEqual([
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
    ])
  })

  it.only(`should return null if no path is found`, () => {
    const grid = makeTestGrid([
      [1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1],
      [0, 0, 1, 0, 1],
      [0, 0, 1, 0, 1],
      [1, 1, 1, 0, 1],
    ])
    const path = findPath(grid, { x: 0, y: 4 }, { x: 4, y: 3 })
    expect(path).toBeNull()
  })
})
