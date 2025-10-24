import { Block } from '../../core/level/legacy/block.ts'
import { filterItems, getConcreteMatrixItem, Matrix } from '../../core/_legacy/matrix.ts'
import { buildMazeLevel, MazeLevelParams } from '../../core/level/legacy'
import { randomItemFromArray } from 'utils'
import { StairType } from './object.ts'

export type MazeLevel = Matrix<Block>

export const buildNewLevel = (params: MazeLevelParams, stairType: StairType): MazeLevel => {
  const level = buildMazeLevel(params)

  const stairNode = randomItemFromArray(getDeadEndBlocks(level))
  stairNode.setStair(stairType)

  return level
}

/**
 * get corridor blocks with two edges faced on the opposite
 */
export const getCorridorBlocks = (level: MazeLevel): Block[] => filterItems(level, (node) => node.isCorridor)

/**
 * get dead-end blocks with just one edge
 */
export const getDeadEndBlocks = (level: MazeLevel): Block[] => filterItems(level, (node) => node.isDeadEnd)

export const getBlockAtPosition = getConcreteMatrixItem
