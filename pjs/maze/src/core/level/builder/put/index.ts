import { MazeGrid } from '../../grid.ts'
import { seedCells, seedOuterCells } from './seed.ts'
import { connectCells } from './connect.ts'

export type PutCellsMethod = (grid: MazeGrid, fillRate: number, connRate: number) => void

export const putCellsWithoutConstraints: PutCellsMethod = (
  grid: MazeGrid,
  fillRate: number,
  connRate: number
): void => {
  seedCells(grid, fillRate)
  connectCells(grid, connRate)
}

export const putCellsWithExit: PutCellsMethod = (
  grid: MazeGrid,
  fillRate: number,
  connRate: number
): void => {
  seedCells(grid, fillRate, true)
  seedOuterCells(grid, 2) // todo: consider the right number
  connectCells(grid, connRate)
}
