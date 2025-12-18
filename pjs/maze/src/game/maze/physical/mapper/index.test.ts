import { gridConverter } from './index.ts'
import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { VerticalLayer } from '../grid.ts'

describe(`${gridConverter.name}`, () => {
  it.each(Array.from({ length: 1 }))(`should convert logical maze grid`, () => {
    const grid = makeTestGrid([
      [0, 0, 2, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ])

    const physicalGrid = gridConverter(grid, { stairType: 'stair', gravity: 1.0, density: 0.5 })

    const slice22 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })

    expect(slice22.get(VerticalLayer.Middle)).toBeNull()
    expect(slice22.get(VerticalLayer.Down1)).not.toBeNull()
  })
})
