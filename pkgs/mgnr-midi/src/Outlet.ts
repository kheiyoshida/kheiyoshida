import { Outlet } from 'mgnr-core/src'
import { Note } from 'mgnr-core/src/generator/Note'
import { MidiChannel } from './Channel'
import { convertToConcreteNote } from './convert'
import { scheduleRepeat } from './timeEvent'

export class MidiOutlet extends Outlet<MidiChannel> {
  get midiCh() {
    return this.inst
  }

  private checkEvent(totalNumOfLoops: number, loopNth: number) {
    if (this.events.elapsed) {
      this.events.elapsed({
        out: this,
        loop: loopNth,
        endTime: 0, //
      })
    }
    if (loopNth === totalNumOfLoops) {
      this.events.ended &&
        this.events.ended({
          out: this,
          loop: totalNumOfLoops,
          endTime: 0, //
          repeatLoop: () => this.loopSequence(totalNumOfLoops),
        })
    }
  }

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

  private sendSequence() {
    this.generator.sequence.iterateEachNote((note, position) => {
      this.sendNote(note, position)
    })
  }

  private sendNote(note: Note, position: number) {
    const concreteNote = convertToConcreteNote(this.generator.scale, note)
    const startInMeasure = position / this.generator.sequence.division
    const endInMeasure = (position + concreteNote.dur) / this.generator.sequence.division
    this.midiCh.sendNote(concreteNote, startInMeasure, endInMeasure)
  }

  private get secsPerMeasure() {
    return this.midiCh.port.msPerMeasure
  }
  private get sequenceDuration() {
    return this.generator.sequence.numOfMeasures * this.secsPerMeasure
  }
}
