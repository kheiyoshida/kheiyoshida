import {
  MazeLevel,
  adjacentPosition,
  getAllAdjacentNodes,
  getPositionNode,
  requireNodeAtPosition,
} from './matrix'
import { Position } from '../../../utils/position'
import { Direction, getTurnedDirection } from '../../../utils/direction'
import { Block } from './block.ts'

/**
 * BFS using position as arguments
 */
export const seekPathByPosition = (matrix: MazeLevel, current: Position, dest: Position): Block[] => {
  const [startNode, destNode] = [current, dest].map((pos) => getPositionNode(matrix, pos))
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
    for (const adj of getAllAdjacentNodes(matrix, lastNodeInPath)) {
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
  const adjPos = adjacentPosition(dir, from.pos, matrix.length)!
  const adjNode = requireNodeAtPosition(matrix, adjPos)
  connectNodes(from, adjNode, dir)
  if (from.distance(to) !== 1) {
    makeShortestPath(matrix, adjNode, to)
  }
}
