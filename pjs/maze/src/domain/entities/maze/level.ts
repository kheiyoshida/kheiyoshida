import { Block } from './block.ts'
import { filterNodes, Matrix } from '../utils/matrix.ts'

export type MazeLevel = Matrix<Block>

/**
 * get corridor blocks with two edges faced in the opposite
 */
export const getCorridorBlocks = (level: MazeLevel): Block[] => filterNodes(level, (node) => node.isCorridor)

/**
 * get dead-end blocks with just one edge
 */
export const getDeadEndBlocks = (level: MazeLevel): Block[] => filterNodes(level, (node) => node.isDeadEnd)
