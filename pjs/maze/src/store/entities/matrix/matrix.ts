import { Position, validatePosition } from '../../../utils/position'
import { Direction, adjacentInDirection } from '../../../utils/direction'
import { Block } from './block.ts'
import { filterNodes, Matrix, foldMatrix } from '../utils/grid.ts'

export type MazeLevel = Matrix<Block>

export const countMatrixNodes = (matrix: MazeLevel): number =>
  foldMatrix(matrix, (p, item) => p + (item !== null ? 1 : 0), 0)

/**
 * get a matrix item in position. position can be invalid (i.e. out of range)
 */
export const getMatrixItem = (matrix: MazeLevel, position: Position): Block | null => {
  const validPos = validatePosition(position, { min: 0, max: matrix.length })
  if (!validPos) return null
  return matrix[validPos[0]][validPos[1]]
}

/**
 * get position's node, assuming node is there
 */
export const getPositionNode = (matrix: MazeLevel, position: Position): Block => {
  const n = getMatrixItem(matrix, position)
  if (n === null) throw Error(`null returned, not Node (at ${position.toString()})`)
  return n
}

/**
 * get adjacent position in provided direction.
 * it can be null if the adjacent position is out of matrix
 */
export const adjacentPosition = (d: Direction, p: Position, matrixSize: number): Position | null =>
  validatePosition(adjacentInDirection(d, p), {
    min: 0,
    max: matrixSize - 1,
  })

/**
 * get the adjacent item.
 * note that returned value can be null
 */
export const getAdjacentItem = (matrix: MazeLevel, nodePos: Position, d: Direction): Block | null => {
  const pos = adjacentPosition(d, nodePos, matrix.length)
  return pos ? getMatrixItem(matrix, pos) : null
}

/**
 * get all the adjacent nodes in the 4 adjacent positions
 */
export const getAllAdjacentNodes = (matrix: MazeLevel, node: Block): Block[] =>
  node.edgeList
    .map((d) => getAdjacentItem(matrix, node.pos, d))
    .filter((n): n is Block => n !== null)

/**
 * put new node at position, and returns the new one
 */
export const putNode = (matrix: MazeLevel, position: Position): Block => {
  const newNode = new Block(position)
  matrix[position[0]][position[1]] = newNode
  return newNode
}

/**
 * look up an item at position, put node if empty
 */
export const requireNodeAtPosition = (matrix: MazeLevel, position: Position): Block =>
  getMatrixItem(matrix, position) || putNode(matrix, position)

/**
 * get corridor nodes with two edges faced in the opposite
 */
export const getCorridorNodes = (matrix: MazeLevel): Block[] =>
  filterNodes(matrix, (node) => node.isCorridor)

/**
 * get deadend nodes with just one edge
 */
export const getDeadendNodes = (matrix: MazeLevel): Block[] =>
  filterNodes(matrix, (node) => node.isDeadEnd)
