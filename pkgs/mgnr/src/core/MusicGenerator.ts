import { Destination } from './Destination'
import { SeqEvent, SeqEventKey } from './SequenceEvent'
import { Generator } from '../generator/Generator'
import { Scale, ScaleConf } from '../generator/Scale'
import { SequenceOut } from './SequenceOut'
import { SequenceNoteMap } from '../generator/Sequence'

export class MusicGenerator<Dest extends Destination<Inst>, Inst> {
  protected destination: Dest

  constructor(destination: Dest) {
    this.destination = destination
  }

  setSequenceOut(gen: Generator, inst: Inst, outId: string, loop?: number, events?: SeqEvent) {
    this.destination.output.set(outId, gen, inst, events)
    this.destination.output.outs[outId].assignSequence(loop)
    return null
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

  handleTimeEvent(key: SeqEventKey, mes: { out: SequenceOut; loop: number; endTime: number }) {
    const eventSpec = mes.out.events[key]
    if (!eventSpec) {
      this.reassignSequence(mes.out, mes.loop, mes.endTime)
    } else {
      // Event[]
      if (Array.isArray(eventSpec)) {
        return eventSpec
      }
      // Handler
      else if (typeof eventSpec === 'function') {
        return eventSpec(mes, this.destination)
      }
      // MutateSpec
      else {
        mes.out.generator.mutate(eventSpec)
      }
    }
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
