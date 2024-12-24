import { Position } from '../../../utils/position'
import { Block } from './block.ts'
import { filterNodes, getAdjacentItem, getMatrixItem, Matrix } from '../utils/matrix.ts'

export type MazeLevel = Matrix<Block>

/**
 * get all the adjacent nodes in the 4 adjacent positions
 */
export const getAllAdjacentBlocks = (level: MazeLevel, block: Block): Block[] =>
  block.edgeList.map((d) => getAdjacentItem(level, block.pos, d)).filter((n): n is Block => n !== null)

/**
 * put a new block at position, and returns the new one
 */
export const putBlock = (level: MazeLevel, position: Position): Block => {
  const newNode = new Block(position)
  level[position[0]][position[1]] = newNode
  return newNode
}

/**
 * look up an item at position, put a block if empty
 */
export const requireBlockAtPosition = (matrix: MazeLevel, position: Position): Block =>
  getMatrixItem(matrix, position) || putBlock(matrix, position)

/**
 * get corridor blocks with two edges faced in the opposite
 */
export const getCorridorBlocks = (level: MazeLevel): Block[] => filterNodes(level, (node) => node.isCorridor)

/**
 * get dead-end blocks with just one edge
 */
export const getDeadEndBlocks = (matrix: MazeLevel): Block[] => filterNodes(matrix, (node) => node.isDeadEnd)
