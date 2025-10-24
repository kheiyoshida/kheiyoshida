import { Position } from 'utils'
import { Direction, getTurnedDirection, LR } from '../grid/direction.ts'

export class Actor {
  position!: Position
  direction!: Direction

  turn(d: LR) {
    this.direction = getTurnedDirection(d, this.direction)
  }

  walk(frontPosition: Position) {
    const from = this.position
    this.position = frontPosition
    return { from, dest: frontPosition }
  }
}
