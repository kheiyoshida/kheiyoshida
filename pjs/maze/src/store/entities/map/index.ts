import { Position } from 'utils'
import { MazeLevel } from '../matrix/matrix'

export type Map = Array<Array<MapCell | null>>

type MapCell = {
  visited: boolean
  stair?: boolean
}

export const trackMap = (grid: Map, from: Position, dest: Position): Map => {
  const [gi, gj] = [dest[0] * 2, dest[1] * 2]
  grid[gi][gj]!.visited = true
  if (from[0] !== dest[0]) {
    const i = from[0] + dest[0]
    grid[i][gj]!.visited = true
  } else {
    const j = from[1] + dest[1]
    grid[gi][j]!.visited = true
  }
  return grid
}

export const buildMap = (matrix: MazeLevel, matrixSize = matrix.length): Map => {
  const gridSize = 2 * matrixSize - 1
  const grid: Map = Array.from(Array(gridSize), () => new Array(gridSize).fill(null))

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      const node = matrix[i][j]
      if (node) {
        grid[i * 2][j * 2] = {
          visited: false,
          stair: node.stair,
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
