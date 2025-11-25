import { stackableBoxConverter } from './stackableBox.ts'
import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { VerticalLayer } from '../grid.ts'
import { IMazeObject } from '../object.ts'

describe(`${stackableBoxConverter.name}`, () => {
  it(`should convert into physical maze of stackable boxes`, () => {
    const logicalGrid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 2],
    ])

    const physicalGrid = stackableBoxConverter(logicalGrid, 'normal')

    // a box for wall cell should be consisting of stacked boxes or be unwalkable
    const slice00 = physicalGrid.getSliceByLogicalPosition({ x: 0, y: 0 })
    const middleObject = slice00.get(VerticalLayer.Middle)?.objects[0]
    const down1Object = slice00.get(VerticalLayer.Down1)?.objects[0]
    const down2Object = slice00.get(VerticalLayer.Down2)?.objects[0]
    const matchRequirement =
      (middleObject?.model.code === 'StackableBox' &&
        down1Object?.model.code === 'StackableBox' &&
        down2Object?.model.code === 'StackableBox') ||
      middleObject === undefined
    expect(matchRequirement).toBe(true)

    // middle layer of floor cell should be empty, and the down1 should have a box
    const slice10 = physicalGrid.getSliceByLogicalPosition({ x: 1, y: 0 })
    expect(slice10.get(VerticalLayer.Down1)?.objects).toMatchObject([{ model: { code: 'StackableBox' } }])
    expect(slice10.get(VerticalLayer.Middle)).toBeNull()

    // stair
    const slice22 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })
    expect(slice22.get(VerticalLayer.Down1)?.objects).toMatchObject([
      { model: { code: 'StackableStairBox' } },
    ] as IMazeObject[])
    expect(slice22.get(VerticalLayer.Down2)?.objects).toMatchObject([{ model: { code: 'StackableBox' } }])

    const slice32 = physicalGrid.getSliceByLogicalPosition({ x: 3, y: 2 })
    expect(slice32.get(VerticalLayer.Down1)?.objects).toHaveLength(0)
    expect(slice32.get(VerticalLayer.Down2)?.objects).toMatchObject([{ model: { code: 'StackableBox' } }])
  })
})
