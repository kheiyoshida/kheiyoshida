import { MazeGrid } from './grid.ts'

import { equals, getAdjacent, Position2D } from '../grid/position2d.ts'
import { NESW } from '../grid/direction.ts'
import { PositionSet } from '../grid/positionSet.ts'

/**
 * find a path in the given grid from start to end using BFS algorithm
 * returns the path as a list of cells
 * if any path doesn't exist between start and end, returns null
 * @param grid
 * @param start
 * @param end
 */
export const findPath = (grid: MazeGrid, start: Position2D, end: Position2D): Position2D[] | null => {
  if (!grid.get(start) || !grid.get(end)) return null

  const visited = new PositionSet()

  const queue = [[start]]
  while (queue.length) {
    const currentPath = queue.shift()!
    const lastPosInPath = currentPath[currentPath.length - 1]
    if (equals(lastPosInPath, end)) return currentPath
    for (const adj of getAllAdjacentCells(lastPosInPath)) {
      if (!visited.has(adj)) {
        visited.add(adj)
        queue.push([...currentPath, adj])
      }
    }
  }
  return null

  function* getAllAdjacentCells(position: Position2D) {
    for (const dir of NESW) {
      const adjacentPos = getAdjacent(position, dir)
      if (grid.get(adjacentPos)) yield adjacentPos
    }
  }
}
