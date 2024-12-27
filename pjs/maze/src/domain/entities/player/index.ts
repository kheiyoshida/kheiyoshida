import { Position } from 'utils'
import { Direction, getTurnedDirection, LR } from '../utils/direction.ts'
import { PlayerStatus, Status } from './status.ts'

export class Player<S extends string> {
  constructor(private statusDeltaMap: Record<S, Status>) {
    this.#playerStatus = new PlayerStatus()
  }

  #playerStatus: PlayerStatus
  #position!: Position
  #direction!: Direction

  get position(): Position {
    return this.#position
  }

  set position(position: Position) {
    this.#position = position
  }

  get direction(): Direction {
    return this.#direction
  }

  set direction(dir: Direction) {
    this.#direction = dir
  }

  get status(): Status {
    return this.#playerStatus.current
  }

  turn(d: LR) {
    this.#direction = getTurnedDirection(d, this.direction)
  }

  walk(frontPosition: Position) {
    const from = this.position
    this.position = frontPosition
    return { from, dest: frontPosition }
  }

  updateStatus(statusKey: S) {
    this.#playerStatus.addStatusValue(this.statusDeltaMap[statusKey])
  }

  reinitialize() {
    this.#playerStatus = new PlayerStatus()
  }

  get isDead() {
    return this.status.sanity <= 0
  }
}
