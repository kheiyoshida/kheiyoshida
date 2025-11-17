import { Maze } from './index.ts'
import { StageContext } from '../stage'

describe(`${Maze.name}`, () => {
  it(`should build the first level based on stage data & param data`, () => {
    const maze = new Maze(new StageContext(), () => [5, 0.5, 0.5])
    maze.setNextLevel()

    expect(maze.currentLevel.physicalGrid.sizeZ).toBe(5)
  })
})
