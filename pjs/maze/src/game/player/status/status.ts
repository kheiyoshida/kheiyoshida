import { INITIAL_STATUS, MAX_STATUS_VALUE, MIN_STATUS_VALUE } from '../../../config'
import { clamp } from 'utils'

export type Status = {
  sanity: number
  stamina: number
}

export class PlayerStatus {
  private sanity!: number
  private stamina!: number

  constructor() {
    this.#reset()
  }

  #reset() {
    this.sanity = INITIAL_STATUS
    this.stamina = INITIAL_STATUS
  }

  get current(): Status {
    return {
      sanity: this.sanity,
      stamina: this.stamina,
    }
  }

  addStatusValue(value: Status) {
    this.sanity = clamp(this.sanity + value.sanity, MIN_STATUS_VALUE, MAX_STATUS_VALUE)
    this.stamina = clamp(this.stamina + value.stamina, MIN_STATUS_VALUE, MAX_STATUS_VALUE)
  }
}
