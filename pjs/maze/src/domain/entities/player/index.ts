import { Position } from 'utils'
import { Direction, getTurnedDirection, LR } from '../utils/direction.ts'
import { MazeStore, statusStore, StatusStore, store } from '../../../store'

export type Status = {
  sanity: number
  stamina: number
}

export class Player {
  constructor(
    private readonly store: MazeStore,
    private readonly statusStore: StatusStore
  ) {}

  get floor(): number {
    return this.store.current.floor
  }

  proceedToNextFloor() {
    this.store.incrementFloor()
  }

  get position(): Position {
    return this.store.current.current
  }

  set position(position: Position) {
    this.store.updateCurrent(position)
  }

  get direction(): Direction {
    return this.store.current.direction
  }

  set direction(value: Direction) {
    this.store.updateDirection(value)
  }

  get status(): Status {
    return this.statusStore.current
  }

  turn(d: LR) {
    store.updateDirection(getTurnedDirection(d, this.direction))
  }

  walk(frontPosition: Position) {
    const from = this.position
    store.updateCurrent(frontPosition)
    return { from, dest: frontPosition }
  }

  updateStatus(statusDelta: Status) {
    if (statusDelta.sanity) {
      statusStore.addStatusValue('sanity', statusDelta.sanity)
    }
    if (statusDelta.stamina) {
      statusStore.addStatusValue('stamina', statusDelta.stamina)
    }
  }
}

