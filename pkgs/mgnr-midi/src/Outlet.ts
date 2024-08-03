import { Note } from 'mgnr-core'
import { Middlewares, Outlet, OutletPort, SequenceGenerator } from 'mgnr-core/src'
import { MidiChannel } from './Channel'
import { convertToConcreteNote } from './convert'
import { scheduleRepeat } from './timeEvent'

export class MidiOutlet extends Outlet<MidiChannel> {
  sendNote(...args: Parameters<MidiChannel['sendNote']>): void {
    this.inst.sendNote(...args)
  }
  assignGenerator<MW extends Middlewares>(generator: SequenceGenerator<MW>) {
    return new MidiOutletPort(this, generator)
  }
  get midiCh() {
    return this.inst
  }
}

export class MidiOutletPort<MW extends Middlewares> extends OutletPort<MidiOutlet, MW> {
  public loopSequence(numOfLoops = 1) {
    const intervalMs = this.sequenceDuration
    scheduleRepeat(intervalMs, numOfLoops, (loopNth) => {
      this.checkEvent(numOfLoops, loopNth)
      this.sendSequence()
    })
    setTimeout(() => {
      this.checkEvent(numOfLoops, numOfLoops)
    }, intervalMs * numOfLoops)
    return this
  }

  private checkEvent(totalNumOfLoops: number, loopNth: number) {
    if (loopNth === totalNumOfLoops) this.handleEnded(totalNumOfLoops, loopNth)
    else this.handleElapsed(loopNth)
  }

  private handleElapsed(loopNth: number) {
    if (!this.events.elapsed) return
    this.events.elapsed(this.generator, loopNth)
  }

  private handleEnded(totalNumOfLoops: number, loopNth: number) {
    if (this.events.ended) {
      this.events.ended(this.generator, loopNth)
    }
    this.loopSequence(this.numOfLoops)
  }

  private sendSequence() {
    this.generator.sequence.iterateEachNote((note, position) => {
      this.sendNote(note, position)
    })
  }

  private sendNote(note: Note, position: number) {
    const concreteNote = convertToConcreteNote(this.generator.scale, note)
    const startInMeasure = position / this.generator.sequence.division
    const endInMeasure = (position + concreteNote.dur) / this.generator.sequence.division
    this.outlet.sendNote(concreteNote, startInMeasure, endInMeasure)
  }

  private get secsPerMeasure() {
    return this.outlet.midiCh.port.msPerMeasure
  }
  private get sequenceDuration() {
    return this.generator.sequence.numOfMeasures * this.secsPerMeasure
  }
}
