import { MazeView, toPosition3D, toViewPosition, ViewPosition, ViewX, ViewY, ViewZ } from './view.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../../game/maze/physical/grid.ts'
import { MazeBlock } from '../../game/maze/physical/block.ts'
import { Position3D } from '../../core/grid/grid3d.ts'

test.each<[ViewPosition, Position3D]>([
  [
    { x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1 },
    { x: 2, y: 0, z: 2 },
  ],
  [
    { x: ViewX.Right1, y: ViewY.Middle, z: ViewZ.L1 },
    { x: 1, y: 0, z: 2 },
  ],
  [
    { x: ViewX.Left1, y: ViewY.Down1, z: ViewZ.L2 },
    { x: 3, y: 1, z: 3 },
  ],
])(`can convert view position and position 3d (i.e. query indices) %o, %o`, (viewPos, pos3d) => {
  expect(toPosition3D(viewPos)).toEqual(pos3d)
  expect(toViewPosition(pos3d)).toEqual(viewPos)
})

describe(`${MazeView.name}`, () => {
  it(`can query blocks in logical left-handed view position`, () => {
    const physicalGrid = new PhysicalMazeGrid(5, 6, 5)
    const block = new MazeBlock([{ modelCode: 'Floor', direction: 'n' }])
    physicalGrid.set({ x: 2, y: 0, z: VerticalLayer.Middle }, block)

    const view = new MazeView(physicalGrid)

    expect(
      view.getBlock({
        x: ViewX.Center,
        y: ViewY.Middle,
        z: ViewZ.L1,
      })
    ).toEqual(block)
  })
})
