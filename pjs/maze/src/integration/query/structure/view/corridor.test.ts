import { AlternativeViewService } from './corridor.ts'
import { Maze } from '../../../../game/maze'
import { buildViewGrid } from './get.ts'
import { ViewX, ViewY, ViewZ } from './view.ts'
import { IMazeObject } from '../../../../game/maze/physical/object.ts'

describe(`corridor service`, () => {
  it(`can combine corridor view with the next level's initial view`, () => {
    const maze = new Maze(() => ({
      size: 5,
      fillRate: 0.5,
      connRate: 0.5,
      startPositionConstraint: 'shouldFaceCorridorWall',
      stairPositionConstraint: 'deadEnd',
    }))
    maze.setNextLevel()
    expect(maze.currentLevel.physicalGrid.sizeZ).toBe(5)

    const startPos = maze.currentLevel.grid.findPosition((_, cell) => !!cell && !!cell.start)
    expect(startPos).toBeDefined()
    const dir = maze.currentLevel.grid.get(startPos!)?.start!.direction

    const currentView = buildViewGrid(maze.currentLevel.physicalGrid, {
      position: startPos!,
      direction: dir!,
    })

    const startingFloorBlock = currentView.getBlock({ x: ViewX.Center, y: ViewY.Down1, z: ViewZ.L1 })

    const service = new AlternativeViewService(maze)
    const corridorView = service.getNextLevelView(currentView)

    for (const viewZ of [ViewZ.L1, ViewZ.L2, ViewZ.L3, ViewZ.L4]) {
      const origin = corridorView.getBlock({
        x: ViewX.Center,
        y: ViewY.Down1,
        z: viewZ,
      })
      expect(origin.objects).toMatchObject([{ model: { code: 'Tile' } }] as IMazeObject[])
    }

    const blockL5 = corridorView.getBlock({
      x: ViewX.Center,
      y: ViewY.Down1,
      z: ViewZ.L5,
    })
    expect(blockL5?.objects).toMatchObject(startingFloorBlock?.objects as IMazeObject[])
  })
})
