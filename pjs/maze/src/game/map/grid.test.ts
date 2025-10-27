import { MapGrid } from './grid.ts'
import { makeTestGrid } from '../../__test__/grid/visualise.ts'

describe(`${MapGrid.name}`, () => {
  it('should convert maze grid to map grid', () => {
    const mazeGrid = makeTestGrid([
      [0, 0, 1],
      [0, 0, 1],
      [2, 1, 1],
    ])

    const mapGrid = new MapGrid(mazeGrid)

    expect(mapGrid.sizeX).toBe(3)
    expect(mapGrid.sizeY).toBe(3)
    expect(mapGrid.get({ x: 2, y: 0 })).toEqual({ visited: false })
    expect(mapGrid.get({ x: 2, y: 1 })).toEqual({ visited: false })
    expect(mapGrid.get({ x: 2, y: 2 })).toEqual({ visited: false })
    expect(mapGrid.get({ x: 1, y: 2 })).toEqual({ visited: false })
    expect(mapGrid.get({ x: 0, y: 2 })).toEqual({ visited: false, stair: true })
  })

  it(`should mark visited cells`, () => {
    const mazeGrid = makeTestGrid([
      [0, 0, 1],
      [0, 0, 1],
      [2, 1, 1],
    ])

    const mapGrid = new MapGrid(mazeGrid)

    mapGrid.visit({ x: 2, y: 0 })

    expect(mapGrid.get({ x: 2, y: 0 })).toEqual({ visited: true })
  })
})
