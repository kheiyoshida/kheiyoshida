import { tilesGridConverter } from './tiles.ts'
import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { IMazeObject } from '../object.ts'

describe(`${tilesGridConverter.name}`, () => {
  it(`should convert logical grid to physical one`, () => {
    const logicalGrid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 2],
    ])

    const physicalGrid = tilesGridConverter(logicalGrid, 'normal')

    expect(physicalGrid.sizeX).toBe(logicalGrid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2)
    expect(physicalGrid.sizeY).toBe(logicalGrid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2)

    const slice00 = physicalGrid.getSliceByLogicalPosition({ x: 0, y: 0 })
    expect(slice00.get(VerticalLayer.Middle)).toBeNull()
    expect(slice00.get(VerticalLayer.Down1)).toBeNull()

    const slice10 = physicalGrid.getSliceByLogicalPosition({ x: 1, y: 0 })
    expect(slice10.get(VerticalLayer.Middle)).toBeNull()
    expect(slice10.get(VerticalLayer.Down1)?.objects).toMatchObject([{ model: { code: 'Tile' } }])

    // stair
    const slice22 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })
    expect(slice22.get(VerticalLayer.Down1)?.objects).toMatchObject([
      { model: { code: 'StairTile' } },
    ] as IMazeObject[])

    const slice32 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 2 })
    expect(slice32.get(VerticalLayer.Down2)?.objects).toMatchObject([
      { model: { code: 'BottomTile' } },
    ] as IMazeObject[])
  })

  it(`can convert warp stair`, () => {
    const logicalGrid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 2],
    ])

    const physicalGrid = tilesGridConverter(logicalGrid, 'warp')

    const slice = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })
    expect(slice.get(VerticalLayer.Middle)?.objects).toMatchObject([
      { model: { code: 'Warp' } },
    ] as IMazeObject[])
    expect(slice.get(VerticalLayer.Down1)?.objects).toMatchObject([
      { model: { code: 'Tile' } },
    ] as IMazeObject[])
  })
})
