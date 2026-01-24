import { PlayerStatus, Status } from './status/status.ts'
import { Actor } from '../../core/actor/actor.ts'

export type StatsUpdatePattern = 'walk' | 'constant' | 'turn' | 'downstairs' | 'idle'

export class Player extends Actor {
  constructor(private statusDeltaMap: Record<StatsUpdatePattern, Status>) {
    super()
    this.#playerStatus = new PlayerStatus()
  }

  #playerStatus: PlayerStatus

  get status(): Status {
    return this.#playerStatus.current
  }

  updateStatus(statusKey: StatsUpdatePattern) {
    this.#playerStatus.addStatusValue(this.statusDeltaMap[statusKey])
  }

  reinitialize() {
    this.#playerStatus = new PlayerStatus()
  }

  get isDead() {
    return this.status.sanity <= 0
  }
}
