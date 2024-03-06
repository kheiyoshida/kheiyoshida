import { Position, validatePosition } from '../../utils/position'
import { Direction, adjacentInDirection } from '../maze/direction'
import { Node } from './node'
import { filterNodes, reduceMatrix } from './iterate'

export type Matrix = Array<Array<Node | null>>

/**
 * Count number of nodes in matrix
 */
export const countNodes = (matrix: Matrix): number =>
  reduceMatrix(matrix, (p, item) => p + (item !== null ? 1 : 0), 0)

/**
 * get a matrix item in position. position can be invalid (i.e. out of range)
 */
export const getMatrixItem = (matrix: Matrix, position: Position): Node | null => {
  const validPos = validatePosition(position, { min: 0, max: matrix.length })
  if (!validPos) return null
  return matrix[validPos[0]][validPos[1]]
}

/**
 * get position's node, assuming node is there
 */
export const getPositionNode = (matrix: Matrix, position: Position): Node => {
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
export const getAdjacentItem = (matrix: Matrix, nodePos: Position, d: Direction): Node | null => {
  const pos = adjacentPosition(d, nodePos, matrix.length)
  return pos ? getMatrixItem(matrix, pos) : null
}

/**
 * get all the adjacent nodes in the 4 adjacent positions
 */
export const getAllAdjacentNodes = (matrix: Matrix, node: Node): Node[] =>
  node.edgeList
    .map((d) => getAdjacentItem(matrix, node.pos, d))
    .filter((n): n is Node => n !== null)

/**
 * put new node at position, and returns the new one
 */
export const putNode = (matrix: Matrix, position: Position): Node => {
  const newNode = new Node(position)
  matrix[position[0]][position[1]] = newNode
  return newNode
}

/**
 * look up an item at position, put node if empty
 */
export const requireNodeAtPosition = (matrix: Matrix, position: Position): Node =>
  getMatrixItem(matrix, position) || putNode(matrix, position)

/**
 * get corridor nodes with two edges faced in the opposite
 */
export const getCorridorNodes = (matrix: Matrix): Node[] =>
  filterNodes(matrix, (node) => node.isCorridor)

/**
 * get deadend nodes with just one edge
 */
export const getDeadendNodes = (matrix: Matrix): Node[] =>
  filterNodes(matrix, (node) => node.isDeadEnd)
