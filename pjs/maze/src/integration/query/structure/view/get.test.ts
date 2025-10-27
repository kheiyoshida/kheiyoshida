import { makeTestGrid } from '../../../../__test__/grid/visualise.ts'
import { PhysicalMazeGrid } from '../../../../game/maze/physical/grid.ts'
import { buildViewGrid, iterateRelative2dViewPositions, ViewOrigin } from './get.ts'
import { ViewPosition, ViewX, ViewY, ViewZ } from './view.ts'
import { IMazeObject } from '../../../../game/maze/physical/object.ts'
import { Position2D } from '../../../../core/grid/position2d.ts'

describe(`${buildViewGrid.name}`, () => {
  it(`should convert the physical maze grid into 5x6x5 grid from player's perspective`, () => {
    const grid = makeTestGrid([
      [0, 1, 0],
      [0, 1, 0],
      [0, 2, 0],
    ])
    const physicalGrid = PhysicalMazeGrid.convert(grid, 'classic')
    const origin: ViewOrigin = {
      position: { x: 1, y: 0 },
      direction: 's',
    }

    const view = buildViewGrid(physicalGrid, origin)

    expect(view.getBlock({ x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1 }).objects).toEqual([
      <IMazeObject>{ modelCode: 'Floor', direction: 's' },
      <IMazeObject>{ modelCode: 'Ceil', direction: 's' },
    ])
    expect(view.getBlock({ x: ViewX.Left1, y: ViewY.Middle, z: ViewZ.L1 }).objects).toEqual([
      { modelCode: 'Wall', direction: 's' },
      { modelCode: 'Wall', direction: 'w' },
      { modelCode: 'Wall', direction: 'n' },
      { modelCode: 'Wall', direction: 'e' },
    ])
    expect(view.getBlock({x: ViewX.Center, y: ViewY.Down1, z: ViewZ.L3 }).objects).toEqual([
      <IMazeObject>{ modelCode: 'StairSteps', direction: 'n' },
    ])
  })
})

test.each<[ViewOrigin, [Pick<ViewPosition, 'x' | 'z'>, Position2D][]]>([
  [
    {
      position: { x: 0, y: 0 },
      direction: 'n',
    },
    [
      [
        { x: ViewX.Left2, z: ViewZ.L1 },
        { x: -2, y: 0 },
      ],
      [
        { x: ViewX.Left1, z: ViewZ.L1 },
        { x: -1, y: 0 },
      ],
      [
        { x: ViewX.Center, z: ViewZ.L1 },
        { x: 0, y: 0 },
      ],
      [
        { x: ViewX.Right2, z: ViewZ.L1 },
        { x: 2, y: 0 },
      ],
      [
        { x: ViewX.Center, z: ViewZ.L6 },
        { x: 0, y: -5 },
      ],
      [
        { x: ViewX.Left2, z: ViewZ.L6 },
        { x: -2, y: -5 },
      ],
    ],
  ],
  [
    {
      position: { x: 2, y: 1 },
      direction: 'e',
    },
    [
      [
        { x: ViewX.Center, z: ViewZ.L1 },
        { x: 2, y: 1 },
      ],
      [
        { x: ViewX.Left2, z: ViewZ.L1 },
        { x: 2, y: -1 },
      ],
      [
        { x: ViewX.Right2, z: ViewZ.L1 },
        { x: 2, y: 3 },
      ],
      [
        { x: ViewX.Center, z: ViewZ.L6 },
        { x: 7, y: 1 },
      ],
      [
        { x: ViewX.Left2, z: ViewZ.L6 },
        { x: 7, y: -1 },
      ],
    ],
  ],
])(`${iterateRelative2dViewPositions.name}`, (viewOrigin, position2ds) => {
  const fn = jest.fn()
  for (const pos of iterateRelative2dViewPositions(viewOrigin)) {
    fn(pos)
  }
  expect(fn).toHaveBeenCalledTimes(6 * 5)
  for (const pos of position2ds) {
    expect(fn).toHaveBeenCalledWith(pos)
  }
})
