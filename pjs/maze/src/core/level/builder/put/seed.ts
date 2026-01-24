import { MazeGrid } from '../../grid.ts'
import { MazeCell } from '../../cell.ts'
import { Position2D } from '../../../grid/position2d.ts'
import { randomIntInclusiveBetween } from 'utils'

/**
 * seed floor cells in classic style.
 * cells are put in even numbered positions
 */
export const seedCells = (grid: MazeGrid, fillRate: number, avoidOuterCircle = false): void => {
  let max
  if (avoidOuterCircle) max = (Math.ceil(grid.sizeX / 2) - 2) * (Math.ceil(grid.sizeY / 2) - 2)
  else max = Math.ceil(grid.sizeX / 2) * Math.ceil(grid.sizeY / 2)

  const cellCount = max * fillRate

  for (let i = 0; i < cellCount; i++) {
    seedCell(grid, avoidOuterCircle)
  }
}

const seedCell = (grid: MazeGrid, avoidOuterCircle: boolean, retry = 0): void => {
  if (retry > 10_000) throw new Error(`max retry exceeded. could not seed node`)
  const pos = grid.getRandomEvenPosition()
  if (!grid.get(pos) && (!avoidOuterCircle || !isOuterCircle(grid.sizeX, pos))) {
    grid.set(pos, new MazeCell())
  } else {
    seedCell(grid, avoidOuterCircle, retry + 1)
  }
}

export const isOuterCircle = (gridSize: number, pos: Position2D): boolean => {
  return (
    pos.x === 0 ||
    pos.x === gridSize - 1 ||
    pos.y === 0 ||
    pos.y === gridSize - 1
  )
}

export const seedOuterCells = (grid: MazeGrid, num: number): void => {
  for (let i = 0; i < num; i++) seedOuterCell(grid)
}

const seedOuterCell = (grid: MazeGrid, retry = 0): void => {
  const iX = randomIntInclusiveBetween(0, 1)
  const iY = randomIntInclusiveBetween(0, 1)
  const x = [0, grid.sizeX - 1][iX]
  const y = [0, grid.sizeY - 1][iY]
  if (grid.get({ x, y })) seedOuterCell(grid, retry + 1)
  grid.set({ x, y }, new MazeCell())
}
