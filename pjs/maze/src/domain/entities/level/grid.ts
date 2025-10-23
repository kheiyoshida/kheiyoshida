import { Grid2D } from '../utils/grid/grid2d.ts'
import { MazeCell } from './cell.ts'
import { direction, equals, getPositionInDirection, Position2D } from '../utils/grid/position2d.ts'

export class MazeGrid extends Grid2D<MazeCell> {
  getDeadEnds(): MazeCell[] {
    return this.filter((_, pos) => this.isDeadEnd(pos))
  }

  isDeadEnd(position: Position2D): boolean {
    return true
  }

  getCorridors(): MazeCell[] {
    return this.filter((_, pos) => this.isCorridor(pos))
  }

  isCorridor(position: Position2D): boolean {
    return true
  }

  /**
   * connect two cells. returns the path as a list of positions
   * @param start
   * @param end
   */
  connect(start: Position2D, end: Position2D): Position2D[] {
    const path: Position2D[] = [start]
    let current = start
    while(!equals(current, end)) {
      const dir = direction(current, end, 'ns')
      const bridgePos = getPositionInDirection(current, dir, 1)
      const targetPos = getPositionInDirection(current, dir, 2)
      console.log(path.length, current, bridgePos, targetPos)
      path.push(bridgePos, targetPos)
      current = targetPos
    }
    for(const pos of path) {
      if (this.get(pos)) continue
      this.set(pos, new MazeCell())
    }
    return path
  }
}
