import { Position } from 'utils'
import { MazeLevel } from '../maze/level.ts'
import { initializeEmptyMatrix, iterateByPosition, Matrix } from '../utils/matrix.ts'
import { store } from '../../../store'

export type Map = Matrix<MapCell>

type MapCell = {
  visited: boolean
  stair?: boolean
}

const resetMap = (level: MazeLevel) => {
  store.updateMap(buildMap(level))
}

const buildMap = (matrix: MazeLevel, matrixSize = matrix.length): Map => {
  const gridSize = 2 * matrixSize - 1
  const grid: Map = initializeEmptyMatrix<Map>(gridSize)

  iterateByPosition(matrix, (matrix, [i, j]) => {
    const node = matrix[i][j]
    if (node) {
      grid[i * 2][j * 2] = {
        visited: false,
        stair: !!node.stair,
      }
      if (node.edges.e) {
        grid[i * 2][j * 2 + 1] = {
          visited: false,
        }
      }
      if (node.edges.s) {
        grid[i * 2 + 1][j * 2] = {
          visited: false,
        }
      }
    }
    return false
  })

  return grid
}

export const track = ({ from, dest }: { from: Position; dest: Position }) => {
  const grid = store.current.grid.slice()

  const [gi, gj] = [dest[0] * 2, dest[1] * 2]
  grid[gi][gj]!.visited = true
  if (from[0] !== dest[0]) {
    const i = from[0] + dest[0]
    grid[i][gj]!.visited = true
  } else {
    const j = from[1] + dest[1]
    grid[gi][j]!.visited = true
  }

  store.updateMap(grid)
}

export const getMapper = () => ({
  resetMap,
  track,
  get map() {
    return store.current.grid
  },
  get isMapOpen() {
    return store.current.mapOpen
  }
})

export type Mapper = ReturnType<typeof getMapper>
