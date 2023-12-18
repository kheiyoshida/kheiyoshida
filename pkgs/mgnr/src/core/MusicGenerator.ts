import { Generator, GeneratorConf } from '../generator/Generator'
import { NotePicker } from '../generator/NotePicker'
import { Scale, ScaleConf } from '../generator/Scale'
import { Sequence, SequenceNoteMap } from '../generator/Sequence'
import { pick } from '../utils/utils'
import { Destination } from './Destination'
import { SeqEvent } from './SequenceEvent'
import { SequenceOut } from './SequenceOut'

export class MusicGenerator<Dest extends Destination<Inst>, Inst> {
  protected destination: Dest

  constructor(destination: Dest) {
    this.destination = destination
  }

  createGenerator(conf: GeneratorConf): Generator {
    const picker = new NotePicker(
      pick(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
      conf.scale
    )
    const sequence = new Sequence(
      pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
    )
    return new Generator(picker, sequence)
  }

  setSequenceOut(gen: Generator, inst: Inst, outId: string, loop?: number, events?: SeqEvent) {
    this.destination.output.set(outId, gen, inst, events)
    this.destination.output.outs[outId].assignSequence(loop)
  }

  changeSequenceLength(
    gen: Generator,
    method: 'shrink' | 'extend',
    len: number,
    exceeded?: 'reverse' | 'erase',
    refill = true
  ) {
    const result = gen.changeSequenceLength(method, len, refill)
    if (result === false) {
      if (exceeded === 'reverse') {
        gen.toggleReverse()
        gen.changeSequenceLength(method, len, refill)
      } else if (exceeded === 'erase') {
        gen.eraseSequenceNotes()
      }
    }
  }

  modulateScale(scale: Scale, next: Partial<ScaleConf>, stages = 0) {
    scale.modulate(next, stages)
    this.adjustPitch(scale)
  }

  adjustPitch(scale: Scale) {
    const gens = this.destination.output.findGeneratorByScale(scale)
    gens.forEach((gen) => gen.adjustPitch())
  }

  reassignSequence(out: SequenceOut, startTime: number, loop?: number) {
    if (!out.isDisposed) {
      out.assignSequence(loop, startTime)
    }
  }

  resetNotes(out: SequenceOut, noteMap?: SequenceNoteMap) {
    out.generator.resetNotes(noteMap)
  }

  disposeSequenceOut(outId: string) {
    this.destination.output.delete(outId)
  }
}
