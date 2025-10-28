import { Grid2D } from '../grid/grid2d.ts'
import { MazeCell } from './cell.ts'
import { direction, equals, getAdjacent, getPositionInDirection, isEven, Position2D } from '../grid/position2d.ts'
import { Direction, getTurnedDirection, NESW } from '../grid/direction.ts'

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

  getDeadEndDirection(position: Position2D): Direction {
    for (const dir of NESW) {
      if (this.get(getAdjacent(position, dir))) return getTurnedDirection('opposite', dir)
    }
    throw new Error('not a dead end')
  }

  getCorridors(): Position2D[] {
    const corridors: Position2D[] = []
    this.iterateItems((_, pos) => {
      if (this.isCorridor(pos) && isEven(pos)) corridors.push(pos)
    })
    return corridors
  }

  isCorridor(position: Position2D): boolean {
    return !!this.getCorridorDir(position);
  }

  getCorridorDir(position: Position2D): Direction | undefined {
    const n = !!this.get(getAdjacent(position, 'n'))
    const s = !!this.get(getAdjacent(position, 's'))
    const e = !!this.get(getAdjacent(position, 'e'))
    const w = !!this.get(getAdjacent(position, 'w'))
    if (n && s && !e && !w) return 'n'
    if (!n && !s && e && w) return 'e'
  }

  getRelativeCell(origin: Position2D, dir: Direction, distance: number): MazeCell | null {
    return this.get(getPositionInDirection(origin, dir, distance))
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
