import { MazeCell, MazeCellType } from '../../core/level/cell.ts'
import { MazeGrid } from '../../core/level/grid.ts'

const NumericalRepresentationMap = {
  0: null,
  1: 'floor',
  2: 'stair',
} as const satisfies Record<number, MazeCellType | null>

type NumericRepresentation = keyof typeof NumericalRepresentationMap

export const makeTestGrid = (input: NumericRepresentation[][]) => {
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

type TextPresentationMap = {
  null: string
  cell: Record<MazeCellType, string>
}

const defaultTextRepresentationMap = {
  null: '0',
  cell: {
    floor: '1',
    stair: '2',
  }
}

const visualise = (map: TextPresentationMap) => (grid: MazeGrid): string => {
  let representation = ``
  for(let y = 0; y < grid.sizeY; y++) {
    representation += `\n`
    for(let x = 0; x < grid.sizeX; x++) {
      const cell = grid.get({ x, y })
      representation += cell ? map.cell[cell.type] : map.null
      representation += ' '
    }
  }

  return representation
}

export const visualizeGrid = visualise(defaultTextRepresentationMap)
export const visualizeGridWithSymbols = visualise({
  null: '_',
  cell: {
    floor: 'F',
    stair: 'S',
  }
})
