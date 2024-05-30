import { SequenceGenerator } from './generator/Generator'
import { SeqEvent, SequenceLoopElapsedHandler, SequenceLoopEndedHandler } from './types'

export abstract class Outlet<Inst = unknown> {
  constructor(protected inst: Inst) {}
  abstract sendNote(...args: unknown[]): void
  abstract assignGenerator(generator: SequenceGenerator): OutletPort<Outlet>
}

export abstract class OutletPort<O extends Outlet = Outlet> {
  constructor(
    readonly outlet: O,
    readonly generator: SequenceGenerator
  ) {}

  readonly events: SeqEvent = {}

  public abstract loopSequence(loop?: number, startTime?: number): OutletPort<O>

  public onElapsed(eventHandler: SequenceLoopElapsedHandler) {
    this.events.elapsed = eventHandler
    return this
  }

  public onEnded(eventHandler: SequenceLoopEndedHandler) {
    this.events.ended = eventHandler
    return this
  }
}
