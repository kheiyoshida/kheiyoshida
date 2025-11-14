import { polesGridConverter } from './poles.ts'
import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { IMazeObject } from '../object.ts'

describe(`${polesGridConverter.name}`, () => {
  it(`should convert logical grid to physical grid`, () => {
    const logicalGrid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 2],
    ])

    const physicalGrid = polesGridConverter(logicalGrid)

    expect(physicalGrid.sizeX).toBe(logicalGrid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2)
    expect(physicalGrid.sizeY).toBe(logicalGrid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2)

    // surrounding
    const slice30 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 0 })
    expect(slice30.get(VerticalLayer.Middle)?.objects).toMatchObject([{ model: { code: 'Pole' } }] as IMazeObject[])

    const slice00 = physicalGrid.getSliceByLogicalPosition({ x: 0, y: 0 })
    expect(slice00.get(VerticalLayer.Middle)?.objects).toMatchObject([{ model: { code: 'Pole' } }] as IMazeObject[])
    expect(slice00.get(VerticalLayer.Down1)).toBeNull()

    const slice10 = physicalGrid.getSliceByLogicalPosition({ x: 1, y: 0 })
    expect(slice10.get(VerticalLayer.Middle)).toBeNull()
    expect(slice10.get(VerticalLayer.Down1)).toBeNull()

    const slice22 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })
    expect(slice22.get(VerticalLayer.Middle)).toBeNull()

    // pathway to the next level
    const slice32 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 2 })
    expect(slice32.get(VerticalLayer.Middle)?.objects).toHaveLength(0)

    const slice42 = physicalGrid.getSliceByLogicalPosition({ x: 4, y: 2 })
    expect(slice42.get(VerticalLayer.Middle)?.objects).toHaveLength(0)

    const slice41 = physicalGrid.getSliceByLogicalPosition({ x: 4, y: 1 })
    expect(slice41.get(VerticalLayer.Middle)?.objects).toMatchObject([{ model: { code: 'Pole' } }] as IMazeObject[])

    const slice62 = physicalGrid.getSliceByLogicalPosition({ x: 6, y: 2 })
    expect(slice62.get(VerticalLayer.Middle)?.objects).toHaveLength(0)
  })
})
