import { SequenceGenerator } from './generator/Generator'
import { SeqEvent, SequenceLoopElapsedHandler, SequenceLoopEndedHandler } from './types'

export abstract class Outlet<Inst = unknown> {
  constructor(protected inst: Inst, mono = false) {}
  abstract assignNote(...args: unknown[]): void
  abstract createPort(): OutletPort<Outlet>
}

export abstract class OutletPort<O extends Outlet = Outlet> {
  get generator(): SequenceGenerator {
    if (!this._generator) throw Error(`generator is not set`)
    return this._generator
  }
  set generator(gen: SequenceGenerator) {
    this._generator = gen
  }
  constructor(
    protected outlet: O,
    private _generator?: SequenceGenerator
  ) {}

  readonly events: SeqEvent = {}

  public abstract loopSequence(loop?: number, startTime?: number): OutletPort

  public onElapsed(eventHandler: SequenceLoopElapsedHandler) {
    this.events.elapsed = eventHandler
    return this
  }

  public onEnded(eventHandler: SequenceLoopEndedHandler) {
    this.events.ended = eventHandler
    return this
  }
}
