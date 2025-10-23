import { MazeGrid } from './grid.ts'

import { equals, getAdjacent, Position2D } from '../utils/grid/position2d.ts'
import { NESW } from '../utils/direction.ts'

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

  const visited = new Set<string>()
  const posKey = (pos: Position2D) => `${pos.x},${pos.y}`

  const queue = [[start]]
  while (queue.length) {
    console.log('queue length: ', queue.length)
    const currentPath = queue.shift()!
    console.log('current path: ', currentPath.length)
    const lastPosInPath = currentPath[currentPath.length - 1]
    if (equals(lastPosInPath, end)) return currentPath
    for (const adj of getAllAdjacentCells(lastPosInPath)) {
      const key = posKey(adj)
      if (!visited.has(key)) {
        visited.add(key)
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
