import { Maze } from './index.ts'
import { RenderingMode } from '../stage'

describe(`${Maze.name}`, () => {
  it(`should build the first level based on stage data & param data`, () => {
    const maze = new Maze(
      [
        {
          style: 5,
          mode: RenderingMode.atmospheric,
        },
      ],
      () => [5, 0.5, 0.5]
    )
    expect(maze.currentLevel.grid.sizeX).toBe(5)
    expect(maze.currentLevel.grid.sizeY).toBe(5)

    expect(maze.currentLevel.physicalGrid.sizeZ).toBe(5)
  })
})
