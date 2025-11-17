import { Maze } from './index.ts'

import { Atmosphere } from '../world'

describe(`${Maze.name}`, () => {
  it(`should build the first level based on stage data & param data`, () => {
    const maze = new Maze(
      [
        {
          style: 5,
          mode: Atmosphere.atmospheric,
        },
      ],
      () => [5, 0.5, 0.5]
    )
    maze.setNextLevel()

    expect(maze.currentLevel.physicalGrid.sizeZ).toBe(5)
  })
})
