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
      maze.setNextLevel()
      const stair = maze.currentLevel.grid.findPosition((pos, item) => item?.type === 'stair')
      if (!stair) {
        console.error(maze.debugParams)
        throw new Error(`stair is missing.`)
      }
      expect(maze.currentLevel.grid.findPosition((pos, item) => item?.start !== undefined)).not.toBeNull()
    }
  })
})
