import { SequenceLoopEventHandler } from '../core/types'
import { Generator } from './generator/Generator'
import { SeqEvent } from './types'

/**
 * Adapter for Generator's Sequence and external sources
 */
export abstract class Outlet<Inst = any> {
  private _generator?: Generator
  get generator(): Generator {
    if (!this._generator) {
      throw Error(`generator is not set yet`)
    }
    return this._generator
  }
  set generator(gen: Generator) {
    this._generator = gen
  }

  readonly inst: Inst

  readonly events: SeqEvent = {}

  constructor(inst: Inst, generator?: Generator) {
    this._generator = generator
    this.inst = inst
  }

  public abstract loopSequence(loop?: number, startTime?: number): Outlet<Inst>

  public onElapsed(eventHandler: SequenceLoopEventHandler) {
    this.events.elapsed = eventHandler
    return this
  }

  public onEnded(eventHandler: SequenceLoopEventHandler) {
    this.events.ended = eventHandler
    return this
  }
}
