import { classicGridConverter } from './classic.ts'
import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { IMazeObject } from '../object.ts'

describe(`${classicGridConverter.name}`, () => {
  it(`should convert the original 2d grid into 3d grid with surrounding blocks`, () => {
    const logicalGrid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 2],
    ])

    const physicalGrid = classicGridConverter(logicalGrid)

    physicalGrid.grid2D.iterate((slice) => {
      expect(slice).toBeDefined()
    })

    // should have 4 walls surrounding the block
    const slice00 = physicalGrid.getSliceByLogicalPosition({ x: 0, y: 0 })
    const expected00Middle: IMazeObject[] = [
      { modelCode: 'Wall', direction: 'n' },
      { modelCode: 'Wall', direction: 'e' },
      { modelCode: 'Wall', direction: 's' },
      { modelCode: 'Wall', direction: 'w' },
    ]
    expect(slice00.get(VerticalLayer.Middle)?.objects).toEqual(expected00Middle)
    expect(slice00.get(VerticalLayer.Up1)).toBeNull()
    expect(slice00.get(VerticalLayer.Down1)).toBeNull()

    // should have a floor and a ceil for floor cells
    const slice10 = physicalGrid.getSliceByLogicalPosition({ x: 1, y: 0 })
    expect(slice10.get(VerticalLayer.Middle)?.objects).toEqual([
      { modelCode: 'Floor', direction: 'n' },
      { modelCode: 'Ceil', direction: 'n' },
    ])
    expect(slice10.get(VerticalLayer.Up1)).toBeNull()
    expect(slice10.get(VerticalLayer.Down1)).toBeNull()

    // stair
    const slice22 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })
    expect(slice22.get(VerticalLayer.Middle)?.objects).toEqual([
      { modelCode: 'StairCeil', direction: 'e' }, // should look forward
    ])
    expect(slice22.get(VerticalLayer.Down1)?.objects).toEqual([{ modelCode: 'StairSteps', direction: 'e' }])

    // walls surrounding stair step
    const slice21 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 1 })
    const slice23 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 3 })
    expect(slice21.get(VerticalLayer.Down1)?.objects).toEqual([{ modelCode: 'Wall', direction: 's' }])
    expect(slice23.get(VerticalLayer.Down1)?.objects).toEqual([{ modelCode: 'Wall', direction: 'n' }])

    // stair corridor
    const slice31 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 1 })
    const slice32 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 2 })
    const slice33 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 3 })
    expect(slice32.get(VerticalLayer.Down1)?.objects).toEqual([
      { modelCode: 'Floor', direction: 'n' },
      { modelCode: 'Ceil', direction: 'n' },
    ])
    expect(slice31.get(VerticalLayer.Down1)?.objects).toEqual([{ modelCode: 'Wall', direction: 's' }])
    expect(slice33.get(VerticalLayer.Down1)?.objects).toEqual([{ modelCode: 'Wall', direction: 'n' }])

    const slice62 = physicalGrid.getSliceByLogicalPosition({ x: 6, y: 2 })
    expect(slice62.get(VerticalLayer.Down1)?.objects).toEqual([
      { modelCode: 'Floor', direction: 'n' },
      { modelCode: 'Ceil', direction: 'n' },
    ])

    // surrounding
    expect(physicalGrid.grid2D.sizeX).toBe(logicalGrid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2)
    expect(physicalGrid.grid2D.sizeY).toBe(logicalGrid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2)

    const outside1 = physicalGrid.get({
      x: PhysicalMazeGrid.SurroundingBlocks - 1,
      y: PhysicalMazeGrid.SurroundingBlocks - 1,
      z: VerticalLayer.Middle,
    })
    expect(outside1?.objects).toEqual([
      { modelCode: 'Wall', direction: 'n' },
      { modelCode: 'Wall', direction: 'e' },
      { modelCode: 'Wall', direction: 's' },
      { modelCode: 'Wall', direction: 'w' },
    ])
    const outside2 = physicalGrid.get({
      x: PhysicalMazeGrid.SurroundingBlocks - 2,
      y: PhysicalMazeGrid.SurroundingBlocks - 2,
      z: VerticalLayer.Middle,
    })
    expect(outside2).toBeNull()
  })
})
