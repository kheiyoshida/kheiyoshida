import { Position2D } from '../../grid/position2d.ts'

const positionKey = (pos: Position2D) => `${pos.x},${pos.y}`
type PositionKey = ReturnType<typeof positionKey>

export class PositionSet {
  private set = new Set<PositionKey>()
  private positions: Position2D[] = []

  constructor(initialPositions: Position2D[] = []) {
    this.set = new Set(initialPositions.map(positionKey))
    this.positions = initialPositions
  }

  has(pos: Position2D): boolean {
    return this.set.has(positionKey(pos))
  }

  add(pos: Position2D): void {
    if (this.has(pos)) return
    this.set.add(positionKey(pos))
    this.positions.push(pos)
  }

  iterator(): IterableIterator<Position2D> {
    return this.positions[Symbol.iterator]()
  }
}
