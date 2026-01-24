import { Direction, getTurnedDirection, LR } from '../grid/direction.ts'
import { getPositionInDirection, Position2D } from '../grid/position2d.ts'

export class Actor {
  position!: Position2D
  direction!: Direction

  turn(d: LR) {
    this.direction = getTurnedDirection(d, this.direction)
  }

  static readonly WalkDistance = 2

  walk() {
    this.position = getPositionInDirection(this.position, this.direction, Actor.WalkDistance)
  }
}
