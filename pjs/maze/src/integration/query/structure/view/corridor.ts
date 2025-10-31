import { MazeView } from './view.ts'
import { MazeCell, MazeCellType } from '../../../../core/level/cell.ts'
import { MazeGrid } from '../../../../core/level/grid.ts'
import { buildViewGrid } from './get.ts'
import { PhysicalMazeGrid } from '../../../../game/maze/physical/grid.ts'

const NumericalRepresentationMap = {
  0: null,
  1: 'floor',
  2: 'stair',
} as const satisfies Record<number, MazeCellType | null>

type NumericRepresentation = keyof typeof NumericalRepresentationMap

const makeGrid = (input: NumericRepresentation[][]): MazeGrid => {
  const sizeY = input.length
  const sizeX = input[0].length

  const grid = new MazeGrid(sizeX, sizeY)
  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      const cellType = NumericalRepresentationMap[input[y][x]]
      if (cellType !== null) {
        grid.set({ x, y }, new MazeCell(cellType))
      }
    }
  }

  return grid
}

const corridorGrid = makeGrid([
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
])

export const ClassicCorridorView: MazeView = buildViewGrid(
  PhysicalMazeGrid.convert(corridorGrid, 'classic'),
  {
    position: { x: 2, y: 4 },
    direction: 'n',
  }
)
