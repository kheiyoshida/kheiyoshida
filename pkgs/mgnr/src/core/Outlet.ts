import { Generator } from './generator/Generator'
import { SeqEvent } from './types'

/**
 * Adapter for Generator's Sequence and external sources
 */
export abstract class Outlet<I = any> {
  readonly generator: Generator
  readonly inst: I
  readonly outId: string
  readonly events: SeqEvent
  constructor(generator: Generator, inst: I) {
    this.outId = ''
    this.generator = generator
    this.inst = inst
    this.events = {}
  }
  public abstract assignSequence(loop?: number, startTime?: number): void

  protected _isDisposed = false
  get isDisposed() {
    return this._isDisposed
  }

  public dispose() {
    this._isDisposed = true
  }
}
