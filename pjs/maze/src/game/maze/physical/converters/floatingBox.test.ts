import { floatingBoxConverter } from './floatingBox.ts'
import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { VerticalLayer } from '../grid.ts'
import { IMazeObject } from '../object.ts'

describe(`${floatingBoxConverter.name}`, () => {
  it(`should convert into a physical grid of floating boxes`, () => {
    const logicalGrid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 2],
    ])

    const physicalGrid = floatingBoxConverter(logicalGrid, 'normal')

    // wall cell should be blocked by a box or empty space
    const slice00 = physicalGrid.getSliceByLogicalPosition({ x: 0, y: 0 })
    const middleObject = slice00.get(VerticalLayer.Middle)?.objects[0].model.code
    const down1Object = slice00.get(VerticalLayer.Down1)?.objects[0].model.code
    const matchRequirement =
      middleObject === 'FloatingBox' || (middleObject === undefined && down1Object === undefined)
    expect(matchRequirement).toBe(true)

    // middle layer of floor cell should be empty, and the down1 should have a box
    const slice10 = physicalGrid.getSliceByLogicalPosition({ x: 1, y: 0 })
    expect(slice10.get(VerticalLayer.Down1)?.objects).toMatchObject([{ model: { code: 'FloatingBox' } }])
    expect(slice10.get(VerticalLayer.Middle)).toBeNull()

    // stair
    const slice22 = physicalGrid.getSliceByLogicalPosition({ x: 2, y: 2 })
    expect(slice22.get(VerticalLayer.Middle)?.objects).toMatchObject([
      { model: { code: 'Warp' } },
    ] as IMazeObject[])
    expect(slice22.get(VerticalLayer.Down1)?.objects).toMatchObject([{ model: { code: 'FloatingBox' } }])
  })
})
