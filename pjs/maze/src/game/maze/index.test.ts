import { Maze } from './index.ts'

describe(`${Maze.name}`, () => {
  it.each(Array.from({ length: 10 }))(`generates valid maze consistently throughout the game`, () => {
    const maze = new Maze()

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
