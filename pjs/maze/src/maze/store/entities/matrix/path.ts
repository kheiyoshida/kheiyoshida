import {
  Matrix,
  adjacentPosition,
  getAllAdjacentNodes,
  getPositionNode,
  requireNodeAtPosition,
} from './matrix'
import { Position } from '../../../utils/position'
import { Direction, compass } from '../../../domain/maze/direction'
import { Node } from './node'

/**
 * BFS using position as arguments
 */
export const seekPathByPosition = (matrix: Matrix, current: Position, dest: Position): Node[] => {
  const [startNode, destNode] = [current, dest].map((pos) => getPositionNode(matrix, pos))
  return seekPath(matrix, startNode, destNode)
}

/**
 * BFS from node to node in matrix
 */
export const seekPath = (matrix: Matrix, start: Node, dest: Node): Node[] => {
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
export const connectNodes = (node: Node, adjacent: Node, direction?: Direction): void => {
  if (!node.isAdjacent(adjacent)) throw Error(`can only connect adjacent nodes`)
  const dir = direction || node.direction(adjacent)
  node.set({ [dir]: true })
  adjacent.set({ [compass('o', dir)]: true })
}

/**
 * make a shortest path from a node to another,
 * connecting and putting nodes recursively
 */
export const makeShortestPath = (matrix: Matrix, from: Node, to: Node): void => {
  const dir = from.direction(to)
  const adjPos = adjacentPosition(dir, from.pos, matrix.length)!
  const adjNode = requireNodeAtPosition(matrix, adjPos)
  connectNodes(from, adjNode, dir)
  if (from.distance(to) !== 1) {
    makeShortestPath(matrix, adjNode, to)
  }
}
