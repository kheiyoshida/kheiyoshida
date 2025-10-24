import { MazeGrid } from '../grid.ts'

export const initGrid = (size: number): MazeGrid => {
  const actualSize = size * 2 - 1
  return new MazeGrid(actualSize, actualSize)
}
