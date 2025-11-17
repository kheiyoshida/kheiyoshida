import { MazeLevel } from './level.ts'
import * as builder from '../../core/level/builder'
import { makeTestGrid, visualizeGrid3D } from '../../__test__/grid/visualise.ts'
import { VerticalLayer } from './physical/grid.ts'

describe(`${MazeLevel.name}`, () => {
  it(`should build maze level`, () => {
    const mockGrid = makeTestGrid([
      [2, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1],
    ])
    jest.spyOn(builder, 'buildMazeGrid').mockReturnValue(mockGrid)
    const level = MazeLevel.build(
      {
        size: 5,
        fillRate: 0.3,
        connRate: 0.3,
        stairPositionConstraint: 'deadEnd',
        startPositionConstraint: 'shouldFaceCorridorWall',
      },
      {
        prev: 'classic',
        current: 'classic',
        next: 'classic',
      }
    )
    const physicalGrid = level.physicalGrid

    console.log(visualizeGrid3D(physicalGrid, VerticalLayer.Middle))
  })
})
