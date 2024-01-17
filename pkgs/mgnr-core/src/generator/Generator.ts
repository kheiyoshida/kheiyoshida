import { fireByRate } from 'utils'
import { Outlet } from '../Outlet'
import { MutateSpec } from '../types'
import { Note } from './Note'
import { NotePicker, NotePickerConf } from './NotePicker'
import { Scale } from './scale/Scale'
import { Sequence, SequenceNoteMap, SequenceConf } from './Sequence'

export type GeneratorConf = {
  scale?: Scale
} & Partial<SequenceConf> &
  Partial<NotePickerConf>

export class SequenceGenerator<I = unknown> {
  readonly picker: NotePicker
  readonly sequence: Sequence
  private outlet!: Outlet<I>

  get scale(): Scale {
    return this.picker.scale
  }

  get notes(): SequenceNoteMap {
    return this.sequence.notes
  }

  constructor(picker: NotePicker, sequence: Sequence) {
    this.picker = picker
    this.sequence = sequence
  }

  public feedOutlet(outlet: Outlet<I>): Outlet<I> {
    if (this.outlet) {
      throw Error(`outlet is already set. create another generator to feed this outlet`)
    }
    outlet.generator = this
    this.outlet = outlet
    return outlet
  }

  public updateConfig(config: Partial<GeneratorConf>): void {
    this.sequence.updateConfig(config)
    this.picker.updateConfig(config)
    // this.eraseSequenceNotes()
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
        this.picker.harmonizeEnabled
          ? initialNotes[position].flatMap((note) => [note, ...this.picker.harmonizeNote(note)])
          : initialNotes[position]
      )
    })
  }

  private assignNotes() {
    switch (this.picker.conf.fillStrategy) {
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
      const notes = this.picker.pickHarmonizedNotes()
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
      this.picker.adjustNotePitch(n)
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
        this.picker.changeNotePitch(n)
      }
    })
  }
}
