import { store } from '../../store'
import { Matrix } from '../matrix'

type Cell = {
  visited: boolean
}

export type Grid = Array<Array<Cell | null>>

export const query = {
  get grid() {
    return store.read('grid')
  },
  get mapOpen() {
    return store.read('mapOpen')
  }
}

export const toggleMap = () => {
  store.update('mapOpen', v => !v)
}

export const reset = () => {
  store.update('grid', buildGrid(store.read('matrix')))
}

export const track = ({ from, dest }: { from: number[]; dest: number[] }) => {
  const grid = store.read('grid').slice()
  const [gi, gj] = [dest[0] * 2, dest[1] * 2]
  grid[gi][gj]!.visited = true
  if (from[0] !== dest[0]) {
    const i = from[0] + dest[0]
    grid[i][gj]!.visited = true
  } else {
    const j = from[1] + dest[1]
    grid[gi][j]!.visited = true
  }
  store.update('grid', grid)
}

const buildGrid = (matrix: Matrix, matrixSize = matrix.length): Grid => {
  const gridSize = 2 * matrixSize - 1
  const grid: Grid = Array.from(Array(gridSize), () =>
    new Array(gridSize).fill(null)
  )

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      const node = matrix[i][j]
      if (node) {
        grid[i * 2][j * 2] = {
          visited: false,
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
    }
  }
  return grid
}
