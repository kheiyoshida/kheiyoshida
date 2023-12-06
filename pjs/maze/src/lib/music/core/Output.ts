import { SequenceOut } from './SequenceOut'
import { Generator } from '../generator/Generator'
import { Scale } from '../generator/Scale'
import { SeqEvent } from './SequenceEvent'
import Logger from 'js-logger'

/**
 * manager class for a collection of `SequenceOut`
 */
export abstract class Output<I> {
  readonly outs: { [outId: string]: SequenceOut<I> }
  constructor() {
    this.outs = {}
  }

  /**
   * search generators that uses the specified scale
   */
  public findGeneratorByScale(scale: Scale): Generator[] {
    return Object.values(this.outs)
      .filter(out => out.generator.scale === scale)
      .map(out => out.generator)
  }

  public abstract set(outId: string, gen: Generator, inst: I, events?: SeqEvent):void

  public delete(outId: string) {
    if (outId in this.outs) {
      this.outs[outId].dispose()
      delete this.outs[outId]
    } else {
      Logger.warn(`failed to delete ${outId}`)
    }
  }
}
