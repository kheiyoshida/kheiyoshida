import { MazeLevel } from '../../../game/maze/level.ts'
import { Position } from '../../_legacy/position.ts'
import { Direction, getTurnedDirection } from '../../grid/direction.ts'
import { Block } from './block.ts'
import {
  adjacentPositionInMatrix,
  getAdjacentItem,
  getConcreteMatrixItem,
  getMatrixItem,
} from '../../_legacy/matrix.ts'

/**
 * BFS using position as arguments
 */
export const seekPathByPosition = (matrix: MazeLevel, current: Position, dest: Position): Block[] => {
  const [startNode, destNode] = [current, dest].map((pos) => getConcreteMatrixItem(matrix, pos))
  return seekPath(matrix, startNode, destNode)
}

/**
 * BFS from node to node in matrix
 */
export const seekPath = (matrix: MazeLevel, start: Block, dest: Block): Block[] => {
  const queue = [[start]]
  while (queue.length) {
    const currentPath = queue.shift()!
    const lastNodeInPath = currentPath[currentPath.length - 1]
    for (const adj of getAllAdjacentBlocks(matrix, lastNodeInPath)) {
      if (adj === dest) {
        return currentPath.concat(adj)
      } else {
        if (!currentPath.includes(adj)) {
          const newPath = currentPath.slice()
          newPath.push(adj)
          queue.push(newPath)
        }
      }
    }
  }
  throw new Error(`couldn't find path`)
}

/**
 * connect adjacent nodes.
 */
export const connectNodes = (node: Block, adjacent: Block, direction?: Direction): void => {
  if (!node.isAdjacent(adjacent)) throw Error(`can only connect adjacent nodes`)
  const dir = direction || node.direction(adjacent)
  node.set({ [dir]: true })
  adjacent.set({ [getTurnedDirection('opposite', dir)]: true })
}

/**
 * make a shortest path from a node to another,
 * connecting and putting nodes recursively
 */
export const makeShortestPath = (matrix: MazeLevel, from: Block, to: Block): void => {
  const dir = from.direction(to)
  const adjPos = adjacentPositionInMatrix(dir, from.position, matrix.length)!
  const adjNode = requireBlockAtPosition(matrix, adjPos)
  connectNodes(from, adjNode, dir)
  if (from.distance(to) !== 1) {
    makeShortestPath(matrix, adjNode, to)
  }
}

/**
 * get all the adjacent nodes in the 4 adjacent positions
 */
export const getAllAdjacentBlocks = (level: MazeLevel, block: Block): Block[] =>
  block.edgeList.map((d) => getAdjacentItem(level, block.position, d)).filter((n): n is Block => n !== null)
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
export const requireBlockAtPosition = (level: MazeLevel, position: Position): Block =>
  getMatrixItem(level, position) || putBlock(level, position)
