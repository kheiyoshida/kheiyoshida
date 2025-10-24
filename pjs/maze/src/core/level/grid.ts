import { Grid2D } from '../grid/grid2d.ts'
import { MazeCell } from './cell.ts'
import {
  direction,
  equals,
  getAdjacent,
  getPositionInDirection,
  Position2D,
} from '../grid/position2d.ts'
import { NESW } from '../grid/direction.ts'

export class MazeGrid extends Grid2D<MazeCell> {
  getDeadEnds(): Position2D[] {
    const deadEnds: Position2D[] = []
    this.iterateItems((_, pos) => {
      this.isDeadEnd(pos) && deadEnds.push(pos)
    })
    return deadEnds
  }

  isDeadEnd(position: Position2D): boolean {
    let count = 0
    for (const dir of NESW) {
      if (this.get(getAdjacent(position, dir))) count++
    }
    return count === 1
  }

  getCorridors(): Position2D[] {
    const corridors: Position2D[] = []
    this.iterateItems((_, pos) => {
      this.isCorridor(pos) && corridors.push(pos)
    })
    return corridors
  }

  isCorridor(position: Position2D): boolean {
    const ns = (!!this.get(getAdjacent(position, 'n'))) && (!!this.get(getAdjacent(position, 's')))
    const ew = (!!this.get(getAdjacent(position, 'e'))) && (!!this.get(getAdjacent(position, 'w')))
    return (ns && !ew) || (!ns && ew)
  }

  /**
   * connect two cells. returns the path as a list of positions
   * @param start
   * @param end
   */
  connect(start: Position2D, end: Position2D): Position2D[] {
    const path: Position2D[] = [start]
    let current = start
    while (!equals(current, end)) {
      const dir = direction(current, end, 'ns')
      const bridgePos = getPositionInDirection(current, dir, 1)
      const targetPos = getPositionInDirection(current, dir, 2)
      path.push(bridgePos, targetPos)
      current = targetPos
    }
    for (const pos of path) {
      if (this.get(pos)) continue
      this.set(pos, new MazeCell())
    }
    return path
  }
}
