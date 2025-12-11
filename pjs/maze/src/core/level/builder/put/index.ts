import { MazeGrid } from '../../grid.ts'
import { StairPositionConstraint } from '../index.ts'
import { seedCells } from './seed.ts'
import { connectCells } from './connect.ts'

export type PutCellsMethod = (grid: MazeGrid, fillRate: number, connRate: number) => void

export const putCellsMethods: Record<StairPositionConstraint, PutCellsMethod> = {
  deadEnd: (grid: MazeGrid, fillRate: number, connRate: number): void => {
    seedCells(grid, fillRate)
    connectCells(grid, connRate)
  },
  exit: (grid: MazeGrid, fillRate: number, connRate: number): void => {
    // TODO: implement
  },
}
