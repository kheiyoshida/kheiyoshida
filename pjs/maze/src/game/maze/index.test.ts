import { Maze } from './index.ts'
import { StageContext } from '../stage'

describe(`${Maze.name}`, () => {
  it(`should build the first level based on stage data & param data`, () => {
    const maze = new Maze(new StageContext(), () => ({
      size: 5,
      fillRate: 0.5,
      connRate: 0.5,
      startPositionConstraint: 'shouldFaceCorridorWall',
      stairPositionConstraint: 'deadEnd',
    }))
    maze.setNextLevel()

    expect(maze.currentLevel.physicalGrid.sizeZ).toBe(5)
  })
})
