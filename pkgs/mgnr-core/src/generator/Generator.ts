import { fireByRate } from 'utils'
import { MutateSpec } from '../types'
import { Note } from './Note'
import {
  NotePickerConf,
  adjustNotePitch,
  changeNotePitch,
  harmonizeNote,
  pickHarmonizedNotes,
} from './NotePicker'
import { Sequence, SequenceConf, SequenceNoteMap } from './Sequence'
import { Scale } from './scale/Scale'

export type GeneratorConf = {
  scale?: Scale
} & Partial<SequenceConf> &
  Partial<NotePickerConf>

export class SequenceGenerator {
  picker: NotePickerConf
  readonly sequence: Sequence

  get notes(): SequenceNoteMap {
    return this.sequence.notes
  }

  constructor(
    picker: NotePickerConf,
    sequence: Sequence,
    readonly scale: Scale = new Scale()
  ) {
    this.picker = picker
    this.sequence = sequence
  }

  public updateConfig(config: Partial<GeneratorConf>): void {
    this.sequence.updateConfig(config)
    this.picker = { ...this.picker, ...config }
    this.constructNotes()
  }

  public constructNotes(initialNotes?: SequenceNoteMap) {
    this.assignInitialNotes(initialNotes)
    this.assignNotes()
  }

  private assignInitialNotes(initialNotes?: SequenceNoteMap) {
    if (!initialNotes) return
    Sequence.iteratePosition(initialNotes, (position) => {
      this.sequence.addNotes(
        position,
        this.picker.harmonizer
          ? initialNotes[position].flatMap((note) => [
              note,
              ...harmonizeNote(note, this.picker, this.scale),
            ])
          : initialNotes[position]
      )
    })
  }

  private assignNotes() {
    switch (this.picker.fillStrategy) {
      case 'random':
      case 'fill':
        this.fillAvailableSpaceInSequence()
        break
      case 'fixed':
        break
    }
  }

  private fillAvailableSpaceInSequence() {
    let fail = 0
    while (this.sequence.availableSpace > 0 && fail < 5) {
      const notes = pickHarmonizedNotes(this.picker, this.scale)
      if (!notes) {
        fail += 1
      } else {
        const pos = this.sequence.getAvailablePosition()
        this.sequence.addNotes(pos, notes)
      }
    }
  }

  public resetNotes(notes?: SequenceNoteMap) {
    this.eraseSequenceNotes()
    this.assignInitialNotes(notes)
    this.removeNotesOutOfLength()
    this.adjustPitch()
    this.assignNotes()
  }

  public eraseSequenceNotes() {
    this.sequence.deleteEntireNotes()
  }

  public adjustPitch() {
    this.sequence.iterateEachNote((n) => {
      adjustNotePitch(n, this.scale, this.picker)
    })
  }

  public changeSequenceLength(
    method: 'shrink' | 'extend',
    length: number,
    onSequenceLengthLimit: (currentMethod: 'shrink' | 'extend') => void = () => undefined
  ) {
    if (method === 'extend') {
      if (!this.sequence.canExtend(length)) return onSequenceLengthLimit(method)
      this.extend(length)
    } else {
      if (!this.sequence.canShrink(length)) return onSequenceLengthLimit(method)
      this.shrink(length)
    }
  }

  private extend(length: number) {
    this.sequence.extend(length)
    this.assignNotes()
  }

  private shrink(length: number) {
    this.sequence.shrink(length)
    this.removeNotesOutOfLength()
  }

  /**
   * delete excessive notes, typically after shrinking
   */
  private removeNotesOutOfLength() {
    this.sequence.iteratePosition((p) => {
      if (p >= this.sequence.length) {
        this.sequence.deleteNotesInPosition(p)
      }
    })
  }

  public mutate({ rate, strategy }: MutateSpec) {
    switch (strategy) {
      case 'randomize':
        this.randomizeNotes(rate)
        break
      case 'move':
        this.moveNotes(rate)
        break
      case 'inPlace':
        this.mutateNotesPitches(rate)
        break
    }
  }

  private randomizeNotes(rate: number) {
    this.sequence.deleteRandomNotes(rate)
    this.assignNotes()
  }

  private moveNotes(rate: number) {
    const removed = this.sequence.deleteRandomNotes(rate)
    this.recycleNotes(removed)
  }

  private recycleNotes(notes: Note[]) {
    notes.forEach((n) => {
      const pos = this.sequence.getAvailablePosition()
      this.sequence.addNote(pos, n)
    })
  }

  private mutateNotesPitches(rate: number) {
    this.sequence.iterateEachNote((n) => {
      if (fireByRate(rate)) {
        changeNotePitch(n, this.scale)
      }
    })
  }
}
