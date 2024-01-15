import { SequenceLoopElapsedHandler, SequenceLoopEndedHandler } from './types'
import { SequenceGenerator } from './generator/Generator'
import { SeqEvent } from './types'

/**
 * Adapter for Generator's Sequence and external sources
 */
export abstract class Outlet<Inst = any> {
  private _generator?: SequenceGenerator
  get generator(): SequenceGenerator {
    if (!this._generator) {
      throw Error(`generator is not set yet`)
    }
    return this._generator
  }
  set generator(gen: SequenceGenerator) {
    this._generator = gen
  }

  readonly inst: Inst

  readonly events: SeqEvent = {}

  constructor(inst: Inst, generator?: SequenceGenerator) {
    this._generator = generator
    this.inst = inst
  }

  public abstract loopSequence(loop?: number, startTime?: number): Outlet<Inst>

  public onElapsed(eventHandler: SequenceLoopElapsedHandler) {
    this.events.elapsed = eventHandler
    return this
  }

  public onEnded(eventHandler: SequenceLoopEndedHandler) {
    this.events.ended = eventHandler
    return this
  }
}
