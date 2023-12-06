import { Generator } from '../generator/Generator'
import { SeqEvent } from './SequenceEvent'

/**
 * Adapter for Generator's Sequence and external sources
 */
export abstract class SequenceOut<I = any> {
  readonly generator: Generator
  readonly inst: I
  readonly outId: string
  readonly events: SeqEvent
  constructor(generator: Generator, inst: I, outId: string, events?: SeqEvent) {
    this.outId = outId
    this.generator = generator
    this.inst = inst
    this.events = events || {}
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
