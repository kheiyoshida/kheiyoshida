import { Maze } from './index.ts'
import { paramBuild } from './params.ts'

describe(`${Maze.name}`, () => {
  it(`should build the first level based on stage data & param data`, () => {
    const maze = new Maze(() => ({
      size: 5,
      fillRate: 0.5,
      connRate: 0.5,
      startPositionConstraint: 'shouldFaceCorridorWall',
      stairPositionConstraint: 'deadEnd',
    }))
    maze.setNextLevel()

    expect(maze.currentLevel.physicalGrid.sizeZ).toBe(5)
  })

  it.each(Array.from({ length: 10 }))(`generates valid maze consistently throughout the game`, () => {
    const maze = new Maze(paramBuild)

    for (let i = 0; i < 30; i++) {
      try {
        maze.setNextLevel()
      } catch (e) {
        console.log(maze.debugParams)
        throw e
      }
    }
  })
})
