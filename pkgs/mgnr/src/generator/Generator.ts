import { MutateSpec } from '../core/SequenceEvent'
import { random } from '../utils/calc'
import { negateIf, pick, randomRemove } from '../utils/utils'
import { Note } from './Note'
import { NotePicker, NotePickerConf } from './NotePicker'
import { Scale } from './Scale'
import { SequenceNoteMap, Sequence, SequenceNotesConf } from './Sequence'

export type SeqConfig = {
  scale?: Scale
}

export interface GeneratorArgs {
  conf: SeqConfig & Partial<SequenceNotesConf> & Partial<NotePickerConf>
  notes?: SequenceNoteMap
}

export class Generator {
  readonly picker: NotePicker
  readonly sequence: Sequence
  private initialNotes!: SequenceNoteMap

  get scale(): Scale {
    return this.picker.scale
  }

  // Does it have to know about picker and sequnece?
  constructor({ conf, notes }: GeneratorArgs) {
    // should be validation here
    this.picker = new NotePicker(
      pick(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
      conf.scale
    )
    this.sequence = new Sequence(
      pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
    )
    this.initialNotes = notes || {}
    this.assignInitialNotes()
    this.assignNotes()
  }

  private assignInitialNotes() {
    const ini = { ...this.initialNotes }
    this.sequence.replaceEntireNotes(ini)
    this.harmonizeNotes()
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

  // should this be here?
  private harmonizeNotes() {
    if (this.picker.harmonizeEnabled) {
      const harmonized: Array<{ pos: number; notes: Note[] }> = []
      this.sequence.iterate((note, pos) => {
        harmonized.push({
          pos,
          notes: this.picker.harmonizeNote(note),
        })
      })
      Object.values(harmonized).forEach((har) => {
        har.notes.forEach((note) => {
          this.sequence.assignNote(har.pos, note)
        })
      })
    }
  }

  public resetNotes() {
    this.eraseSequenceNotes()
    this.assignInitialNotes()
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
    this.randomRemove(rate)
    this.assignNotes()
  }

  private moveNotes(rate: number) {
    const removed = this.randomRemove(rate)
    this.recycleNotes(removed)
  }

  /**
   * @returns removed notes that can be relocated
   */
  public randomRemove(rate = 0.5) {
    let removed: Note[] = []
    this.sequence.iteratePosition((i) => {
      const [survived, rm] = randomRemove(this.sequence.notes[i], rate)
      if (survived.length) {
        this.sequence.replaceNotesInPosition(i, survived)
      } else {
        this.sequence.deleteNotesInPosition(i)
      }
      removed = removed.concat(rm)
    })
    return removed
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
