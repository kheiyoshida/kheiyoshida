import { MazeGrid } from '../../grid.ts'
import { MazeCell } from '../../cell.ts'

/**
 * seed floor cells in classic style.
 * cells are put in even numbered positions
 */
export const seedCells = (grid: MazeGrid, fillRate: number): void => {
  const max = Math.ceil(grid.sizeX / 2) * Math.ceil(grid.sizeY / 2)
  const cellCount = max * fillRate

  for (let i = 0; i < cellCount; i++) {
    seedCell(grid)
  }
}

const seedCell = (grid: MazeGrid, retry = 0): void => {
  if (retry > 10_000) throw new Error(`max retry exceeded. could not seed node`)
  const pos = grid.getRandomEvenPosition()
  if (!grid.get(pos)) {
    grid.set(pos, new MazeCell())
  } else {
    seedCell(grid, retry + 1)
  }
}
