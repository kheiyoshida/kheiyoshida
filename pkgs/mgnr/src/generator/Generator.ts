import { MutateSpec } from '../core/SequenceEvent'
import { random } from '../utils/calc'
import { negateIf, pick } from '../utils/utils'
import { Note } from './Note'
import { NotePicker, NotePickerConf } from './NotePicker'
import { Scale } from './Scale'
import { Sequence, SequenceNoteMap, SequenceNotesConf } from './Sequence'

export type SeqConfig = {
  scale?: Scale
}

export interface GeneratorArgs {
  conf: SeqConfig & Partial<SequenceNotesConf> & Partial<NotePickerConf>
  notes?: SequenceNoteMap
}

export function construct({ conf, notes }: GeneratorArgs): Generator {
  const picker = new NotePicker(
    pick(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
    conf.scale
  )
  const sequence = new Sequence(
    pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
  )
  const generator = new Generator(picker, sequence)
  generator.constructNotes(notes)
  return generator
}

export class Generator {
  readonly picker!: NotePicker
  readonly sequence!: Sequence

  get scale(): Scale {
    return this.picker.scale
  }

  constructor(picker: NotePicker, sequence: Sequence)
  constructor({ conf, notes }: GeneratorArgs)
  constructor(genArgsOrPicker: GeneratorArgs | NotePicker, sequence?: Sequence) {
    if (genArgsOrPicker instanceof NotePicker && sequence) {
      this.picker = genArgsOrPicker
      this.sequence = sequence
      // remember to call constructNotes
    } else return construct(genArgsOrPicker)
  }

  public constructNotes(initialNotes?: SequenceNoteMap) {
    this.assignInitialNotes(initialNotes)
    this.assignNotes()
  }

  private assignInitialNotes(initialNotes?: SequenceNoteMap) {
    if (!initialNotes) return
    Sequence.iterateNoteMapPosition(initialNotes, (position) => {
      this.sequence.assignNotes(
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
        this.sequence.assignNotes(pos, notes)
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
    this.sequence.iterate((n) => {
      if (this.picker.checkStaleNote(n)) {
        this.picker.adjustNotePitch(n)
      }
    })
  }

  private reverseLengthChangeDirection = false

  public toggleReverse() {
    this.reverseLengthChangeDirection = !this.reverseLengthChangeDirection
  }

  public changeSequenceLength(method: 'shrink' | 'extend', length: number, refill = true): boolean {
    if (negateIf(this.reverseLengthChangeDirection, method === 'extend')) {
      return this.extend(length, refill)
    } else {
      return this.shrink(length, refill)
    }
  }

  private extend(len: number, refill = true) {
    if (!this.sequence.canExtend(len)) return false
    this.sequence.extend(len)
    refill && this.assignNotes()
    return true
  }

  private shrink(len: number, refill = true) {
    if (!this.sequence.canShrink(len)) return false
    this.sequence.shrink(len)
    this.removeNotesOutOfLength()
    refill && this.assignNotes()
    return true
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
      this.sequence.assignNote(pos, n)
    })
  }

  private mutateNotesPitches(rate: number) {
    this.sequence.iterate((n) => {
      if (random(rate)) {
        this.picker.changeNotePitch(n)
      }
    })
  }
}
