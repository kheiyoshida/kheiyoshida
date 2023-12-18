import { Output } from '../../core/Output'
import { SeqEvent } from '../../core/SequenceEvent'
import { Generator } from '../../generator/Generator'
import { ToneInst, ToneSequenceOut } from './SequenceOut'

export class ToneOutput extends Output<ToneInst> {
  public set(outId: string, gen: Generator, inst: ToneInst, ) {
    this.outs[outId] = new ToneSequenceOut(gen, inst, )
  }
}
