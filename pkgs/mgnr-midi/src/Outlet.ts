import { Outlet } from 'mgnr-core/src'
import { MidiChannel } from './Channel'
import { convertToConcreteNote } from './convert'
import { Note } from 'mgnr-core/src/generator/Note'

export class MidiOutlet extends Outlet<MidiChannel> {
  get midiCh() {
    return this.inst
  }
  public loopSequence() {
    this.generator.sequence.iterateEachNote((note, position) => {
      this.sendNote(note, position)
    })
    return this
  }

  private sendNote(note: Note, position: number) {
    const concreteNote = convertToConcreteNote(this.generator.scale, note)
    const startInMeasure = position / this.generator.sequence.division
    const endInMeasure = (position + concreteNote.dur) / this.generator.sequence.division
    this.midiCh.sendNote(concreteNote, startInMeasure, endInMeasure)    
  }
}
