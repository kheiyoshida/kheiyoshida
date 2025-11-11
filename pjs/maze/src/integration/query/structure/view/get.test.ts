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
      <IMazeObject>{ model: { code: 'Floor' }, direction: 's' },
      <IMazeObject>{ model: { code: 'Ceil' }, direction: 's' },
    ])
    expect(view.getBlock({ x: ViewX.Left1, y: ViewY.Middle, z: ViewZ.L1 }).objects).toEqual([
      { model: { code: 'Wall' }, direction: 's' },
      { model: { code: 'Wall' }, direction: 'w' },
      { model: { code: 'Wall' }, direction: 'n' },
      { model: { code: 'Wall' }, direction: 'e' },
    ] as IMazeObject[])
    expect(view.getBlock({x: ViewX.Center, y: ViewY.Down1, z: ViewZ.L3 }).objects).toEqual([
      <IMazeObject>{ model: { code: 'StairSteps' }, direction: 'n' },
    ])
  })

  it(`should convert the physical maze grid into 5x6x5 grid from player's perspective`, () => {
    const grid = makeTestGrid([
      [0, 0, 0],
      [1, 1, 2],
      [0, 0, 0],
    ])
    const physicalGrid = PhysicalMazeGrid.convert(grid, 'classic')
    const origin: ViewOrigin = {
      position: { x: 0, y: 1 },
      direction: 'e',
    }

    const view = buildViewGrid(physicalGrid, origin)

    expect(view.getBlock({ x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1 }).objects).toEqual([
      <IMazeObject>{ model: { code: 'Floor' }, direction: 'w' },
      <IMazeObject>{ model: { code: 'Ceil' }, direction: 'w' },
    ])
    expect(view.getBlock({ x: ViewX.Left1, y: ViewY.Middle, z: ViewZ.L1 }).objects).toEqual([
      { model: { code: 'Wall' }, direction: 'w' },
      { model: { code: 'Wall' }, direction: 'n' },
      { model: { code: 'Wall' }, direction: 'e' },
      { model: { code: 'Wall' }, direction: 's' },
    ] as IMazeObject[])
    expect(view.getBlock({x: ViewX.Center, y: ViewY.Down1, z: ViewZ.L3 }).objects).toEqual([
      <IMazeObject>{ model: { code: 'StairSteps' }, direction: 'n' },
    ])
  })

  test(`debug`, () => {
    const grid = makeTestGrid([
      [0, 0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 2, 0],
      [0, 0, 0, 0, 0, 0],
    ])
    const physicalGrid = PhysicalMazeGrid.convert(grid, 'classic')
    const origin: ViewOrigin = {
      position: { x: 2, y: 3 },
      direction: 'e',
    }

    buildViewGrid(physicalGrid, origin)
    buildViewGrid(physicalGrid, origin)
    buildViewGrid(physicalGrid, origin)

    const view = buildViewGrid(physicalGrid, origin)

    expect(view.getBlock({ x: ViewX.Center, y: ViewY.Middle, z: ViewZ.L1}).objects).toHaveLength(2)
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
