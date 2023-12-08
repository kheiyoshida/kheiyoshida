import { MutateSpec } from '../core/SequenceEvent'
import { random } from '../utils/calc'
import { negateIf, pick, randomRemove } from '../utils/utils'
import { Note } from './Note'
import { NotePicker, NotePickerConf } from './NotePicker'
import { Scale } from './Scale'
import { SeqNotes, Sequence, SequenceNotesConf } from './Sequence'

export type SeqConfig = {
  scale?: Scale
}

export interface GeneratorArgs {
  conf: SeqConfig & Partial<SequenceNotesConf> & Partial<NotePickerConf>
  notes?: SeqNotes
}

export class Generator {

  readonly picker: NotePicker

  readonly sequence: Sequence

  get scale(): Scale {
    return this.picker.scale
  }

  constructor({ conf, notes }: GeneratorArgs) {
    // should be validation here
    this.picker = new NotePicker(
      pick(conf, [
        'noteDur',
        'noteVel',
        'veloPref',
        'fillStrategy',
        'harmonizer',
      ]),
      conf.scale
    )
    this.sequence = new Sequence(
      pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
    )
    this.initialNotes = notes || {}
    this.assignInitialNotes()
    this.assignNotes()
  }

  private initialNotes!: SeqNotes

  private assignInitialNotes() {
    const ini = {...this.initialNotes}
    this.sequence.replaceEntireNotes(ini)
    this.harmonize()
  }

  private assignNotes() {
    switch (this.picker.conf.fillStrategy) {
      case 'random':
      case 'fill':
        this.fill()
        break
      case 'fixed':
        break
    }
  }

  private fill() {
    let fail = 0
    while (this.sequence.availableSpace > 0 && fail < 5) {
      const notes = this.picker.pickHarmonized()
      if (!notes) {
        fail += 1
      } else {
        const pos = this.sequence.getAvailablePosition()
        this.sequence.assignNotes(pos, notes)
      }
    }
  }

  private harmonize() {
    if (this.picker.harmonizeEnabled) {
      const harmonized: Array<{ pos: number; notes: Note[] }> = []
      this.sequence.iterate((note, pos) => {
        harmonized.push({
          pos,
          notes: this.picker.harmonize(note),
        })
      })
      Object.values(harmonized).forEach((har) => {
        har.notes.forEach((note) => {
          this.sequence.assignNote(har.pos, note)
        })
      })
    }
  }

  private recycle(notes: Note[]) {
    notes.forEach((n) => {
      const pos = this.sequence.getAvailablePosition()
      this.sequence.assignNote(pos, n)
    })
  }

  /**
   * invoke initial notes.
   * i.e. reboot the initial assign process, but it cares the current config
   */
  private invokeInitialNotes() {
    if (!this.sequence.isEmpty) return
    this.assignInitialNotes()
    this.removeNotesOutOfLength()
    this.adjustPitch()
  }

  /**
   * empty sequence
   */
  public erase() {
    this.sequence.clearNotes()
  }

  /**
   * empty sequence and assign notes again
   */
  public resetNotes() {
    this.erase()
    this.invokeInitialNotes()
    this.assignNotes()
  }

  /**
   * Check if current notes are in tune with the current scale.
   * if not, adust notes so that it can represent the current scale
   */
  public adjustPitch() {
    this.sequence.iterate((n) => {
      if (this.picker.checkStaleNote(n)) {
        this.picker.adjustNotePitch(n)
      }
    })
  }

  /**
   * flag for controlling the length change direction
   */
  private reverse = false

  /**
   * toggle direction of extend/shrink
   */
  public toggleReverse() {
    this.reverse = !this.reverse
  }

  /**
   * change sequence's length.
   * if it couldn't change (when it reaches the limit), notify by returning false.
   * 
   * @param method change direction
   * @param len amount of sequence length it will change
   * @param refill reassign notes in the extended space
   * @returns result of operation
   */
  public changeSequenceLength(
    method: 'shrink' | 'extend',
    len: number,
    refill = true
  ):boolean {
    if (negateIf(this.reverse, method === 'extend')) {
      return this.extend(len, refill)
    } else {
      return this.shrink(len, refill)
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
   * delete excessive notes after shrinking
   */
  private removeNotesOutOfLength() {
    this.sequence.iteratePos((p) => {
      if (p >= this.sequence.length) {
        this.sequence.deletePosition(p)
      }
    })
  }

  /**
   * remove notes randomly
   * @returns removed notes. can be recycled for relocation
   */
  public randomRemove(rate = 0.5) {
    let removed: Note[] = []
    this.sequence.iteratePos((i) => {
      const [survived, rm] = randomRemove(this.sequence.notes[i], rate)
      if (survived.length) {
        this.sequence.replaceNotes(i, survived)
      } else {
        this.sequence.deletePosition(i)
      }
      removed = removed.concat(rm)
    })
    return removed
  }

  /**
   * mutate notes' position, pitch, velocity, durtion, etc.
   * @param rate fire rate for each mutate operation on a note
   */
  public mutate({ rate, strategy }: MutateSpec) {
    switch (strategy) {
      case 'randomize':
        this.mutateRandomize(rate)
        break
      case 'move':
        this.mutateMove(rate)
        break
      case 'inPlace':
        this.mutateInPlace(rate)
        break
    }
  }

  /**
   * randomly remove note and assign new notes in random position
   */
  private mutateRandomize(rate: number) {
    this.randomRemove(rate)
    this.assignNotes()
  }

  /**
   * move note to another position
   */
  private mutateMove(rate: number) {
    const removed = this.randomRemove(rate)
    this.recycle(removed)
  }

  /**
   * only change note's pitch in its current position
   */
  private mutateInPlace(rate: number) {
    this.sequence.iterate((n) => {
      if (random(rate)) {
        this.picker.changeNotePitch(n)
      }
    })
  }
}
