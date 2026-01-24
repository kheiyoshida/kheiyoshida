import { StairMapper } from './stair.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { getPositionInDirection, Position2D } from '../../../../core/grid/position2d.ts'

describe(`stair mapping`, () => {
  test(`stair`, () => {
    const stairMapper = new StairMapper({
      density: 0.5,
      gravity: 0.5,
      order: 1,
      scale: 1,
      stairType: 'stair',
    })

    const grid = new PhysicalMazeGrid(15, 15, 5)

    const stairPos: Position2D = { x: 2, y: 0 }
    stairMapper.mapStairSlices(grid, stairPos, 'n')

    // stair pos should have stair and ceil
    expect(
      grid.getSliceByLogicalPosition(stairPos).get(VerticalLayer.Down1)?.objects[0].model.usage === 'stair'
    ).toBe(true)

    // corridor path
    for (let i = 1; i <= 4; i++) {
      const pathPos = getPositionInDirection(stairPos, 'n', i)
      expect(grid.getSliceByLogicalPosition(pathPos).get(VerticalLayer.Down1)).toBeNull()
      expect(grid.getSliceByLogicalPosition(pathPos).get(VerticalLayer.Down2)).not.toBeNull()
    }
  })

  test(`lift`, () => {
    const stairMapper = new StairMapper({
      density: 0.5,
      gravity: 0.5,
      order: 1,
      scale: 1,
      stairType: 'lift',
    })

    const grid = new PhysicalMazeGrid(15, 15, 6)

    const stairPos: Position2D = { x: 2, y: 0 }
    stairMapper.mapStairSlices(grid, stairPos, 'n')

    // stair pos should have stair and ceil
    expect(grid.getSliceByLogicalPosition(stairPos).get(VerticalLayer.Middle)).toBeNull()
    expect(
      grid.getSliceByLogicalPosition(stairPos).get(VerticalLayer.Down1)?.objects[0].model.usage === 'stair'
    ).toBe(true)

    // corridor path
    for (let i = 1; i <= 4; i++) {
      const pathPos = getPositionInDirection(stairPos, 'n', i)
      expect(grid.getSliceByLogicalPosition(pathPos).get(VerticalLayer.Down2)).toBeNull()
      // expect(grid.getSliceByLogicalPosition(pathPos).get(VerticalLayer.Down3)).not.toBeNull()
    }
  })

  test(`path`, () => {
    const stairMapper = new StairMapper({
      density: 0.5,
      gravity: 0.5,
      order: 1,
      scale: 1,
      stairType: 'path',
    })

    const grid = new PhysicalMazeGrid(15, 15, 5)

    const stairPos: Position2D = { x: 2, y: 0 }
    stairMapper.mapStairSlices(grid, stairPos, 'n')

    // corridor path
    for (let i = 0; i <= 4; i++) {
      const pathPos = getPositionInDirection(stairPos, 'n', i)
      expect(grid.getSliceByLogicalPosition(pathPos).get(VerticalLayer.Middle)).toBeNull()
      expect(grid.getSliceByLogicalPosition(pathPos).get(VerticalLayer.Down1)).not.toBeNull()
    }
  })
})
