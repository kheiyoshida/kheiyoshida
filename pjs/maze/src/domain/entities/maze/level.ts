import { Block } from './block.ts'
import { filterItems, getConcreteMatrixItem, Matrix } from '../utils/matrix.ts'
import { buildMazeLevel, MazeLevelParams } from './factory'
import { store } from '../../../store'
import { randomItemFromArray } from 'utils'
import { StairType } from './object.ts'

export type MazeLevel = Matrix<Block>

export const buildNewLevel = (params: MazeLevelParams, stairType: StairType): void => {
  const level = buildMazeLevel(params)

  const stairNode = randomItemFromArray(getDeadEndBlocks(level))
  stairNode.setStair(stairType)
  store.renewMatrix(level)
}

export const getCurrentLevel = () => store.current.matrix

/**
 * get corridor blocks with two edges faced in the opposite
 */
export const getCorridorBlocks = (level: MazeLevel): Block[] => filterItems(level, (node) => node.isCorridor)

/**
 * get dead-end blocks with just one edge
 */
export const getDeadEndBlocks = (level: MazeLevel): Block[] => filterItems(level, (node) => node.isDeadEnd)

export const getBlockAtPosition = getConcreteMatrixItem
