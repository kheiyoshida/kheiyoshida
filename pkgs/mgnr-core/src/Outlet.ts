import { Middlewares, SequenceGenerator } from './Generator'
import { LoopEvent, SequenceLoopHandler } from './types'

export abstract class Outlet<Inst = unknown> {
  constructor(protected inst: Inst) {}
  abstract sendNote(...args: unknown[]): void
  abstract assignGenerator<GMW extends Middlewares>(generator: SequenceGenerator<GMW>): OutletPort<Outlet<Inst>, GMW>
}

export abstract class OutletPort<O extends Outlet, GMW extends Middlewares = Middlewares> {
  constructor(
    readonly outlet: O,
    readonly generator: SequenceGenerator<GMW>
  ) {}

  readonly events: LoopEvent<GMW> = {}

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

  public abstract loopSequence(numOfLoops?: number, startTime?: number): OutletPort<O, GMW>

  public onElapsed(eventHandler: SequenceLoopHandler<GMW>) {
    this.events.elapsed = eventHandler
    return this
  }

  public onEnded(eventHandler: SequenceLoopHandler<GMW>) {
    this.events.ended = eventHandler
    return this
  }
}
