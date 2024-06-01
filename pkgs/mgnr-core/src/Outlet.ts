import { SequenceGenerator } from './generator/Generator'
import { LoopEvent, SequenceLoopHandler } from './types'

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

  readonly events: LoopEvent = {}

  private _numOfLoops: number = 1
  get numOfLoops() {
    return this._numOfLoops
  }
  set numOfLoops(value: number) {
    if (value < 1 || !Number.isInteger(value)) {
      this._numOfLoops = 0
    }
    this._numOfLoops = value
  }

  public abstract loopSequence(numOfLoops?: number, startTime?: number): OutletPort<O>

  public onElapsed(eventHandler: SequenceLoopHandler) {
    this.events.elapsed = eventHandler
    return this
  }

  public onEnded(eventHandler: SequenceLoopHandler) {
    this.events.ended = eventHandler
    return this
  }
}
