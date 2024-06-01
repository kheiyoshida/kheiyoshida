import Logger from 'js-logger'
import {
  Range,
  normalizeRange,
  overrideDefault,
  randomIntBetween,
  randomRemoveFromArray,
} from 'utils'
import { Note } from './Note'

type SeqDivision = 16 | 8 | 4 | 2 | 1

export type SequenceConf = {
  length: number
  lenRange: Range
  density: number
  division: SeqDivision
  fillPref: 'mono' | 'allowPoly'
}

export type SequenceNoteMap = {
  [position: number]: Note[]
}

export class Sequence {
  private _notes: SequenceNoteMap = {}
  public get notes(): SequenceNoteMap {
    return this._notes
  }

  protected conf: SequenceConf

  get poly() {
    return this.conf.fillPref === 'allowPoly'
  }

  /**
   * the number of divisions
   * e.g. length 8 means 8 sixteenth notes in a sequence
   */
  get length(): number {
    return this.conf.length
  }

  /**
   * min/max limit to which sequence can shrink/extend
   */
  get lenRange() {
    return this.conf.lenRange
  }

  /**
   * unit of each note with length 1
   */
  get division() {
    return this.conf.division
  }

  /**
   * the ratio of notes/available space
   */
  get density(): number {
    return this.conf.density
  }

  get availableSpace() {
    return this.maxNumOfNotes - this.usedSpace
  }

  get maxNumOfNotes() {
    return Math.floor(this.length * this.density)
  }

  get usedSpace() {
    let used = 0
    this.iterateEachNote((note) => {
      used += normalizeRange(note.dur)
    })
    return used
  }

  /**
   * number of measures for a loop of sequence.
   * e.g. length20 / division16 = 1.25 measures
   */
  get numOfMeasures(): number {
    return this.length / this.division
  }

  get isEmpty() {
    return this.numOfNotes === 0
  }

  /**
   * note this is different from `usedSpace`.
   * it doesn't care note length
   */
  get numOfNotes() {
    let num = 0
    this.iterateEachNote((_) => (num += 1))
    return num
  }

  static DefaultConf: SequenceConf = {
    length: 16,
    lenRange: {
      min: 2,
      max: 50,
    },
    division: 16,
    density: 0.5,
    fillPref: 'allowPoly',
  }

  constructor(conf: Partial<SequenceConf> = {}) {
    this.conf = overrideDefault(Sequence.DefaultConf, conf)
  }

  public updateConfig(conf: Partial<SequenceConf>) {
    this.conf = overrideDefault(this.conf, conf)
  }

  public addNote(pos: number | undefined, note: Note) {
    if (pos === undefined || pos >= this.length) return
    if (this.notes[pos]) {
      this.notes[pos].push(note)
    } else {
      this.notes[pos] = [note]
    }
  }

  public addNotes(pos: number | undefined, notes: Note[]) {
    for (const n of notes) {
      this.addNote(pos, n)
    }
  }

  public replaceEntireNotes(notes: SequenceNoteMap) {
    this._notes = notes
  }

  public replaceNotesInPosition(position: number, notes: Note[]) {
    if (!notes || !notes.length) {
      throw Error(`replaceNotes called with empty notes`)
    }
    this.notes[position] = notes
  }

  public deleteEntireNotes() {
    this._notes = {}
  }

  public deleteNotesInPosition(position: number) {
    if (this.notes[position]) {
      delete this.notes[position]
    }
  }

  public deleteNoteFromPosition(position: number, note: Note) {
    if (this.notes[position]) {
      this.notes[position] = this.notes[position].filter((n) => n !== note)
    }
  }

  public deleteRandomNotes(rate: number): Note[] {
    let removed: Note[] = []
    this.iteratePosition((i) => {
      const [survived, rm] = randomRemoveFromArray(this.notes[i], rate)
      if (survived.length) {
        this.replaceNotesInPosition(i, survived)
      } else {
        this.deleteNotesInPosition(i)
      }
      removed = removed.concat(rm)
    })
    return removed
  }

  private searchEmptyPosition(n = 0): number | undefined {
    const seqLen = this.length
    if (n > 50) {
      Logger.warn(`There's no available position`)
      return
    }
    const pos = randomIntBetween(0, seqLen)
    if (this.notes[pos]) {
      return this.searchEmptyPosition(n + 1)
    }
    return pos
  }

  /**
   * get available position for a note.
   * if poly allowed, just returns random position
   */
  public getAvailablePosition() {
    return this.conf.fillPref === 'mono'
      ? this.searchEmptyPosition()
      : randomIntBetween(0, this.length)
  }

  public canExtend(byLength: number) {
    return this.lenRange.max > this.length + byLength
  }

  public extend(len: number) {
    this.conf.length += len
  }

  public canShrink(byLength: number) {
    return this.length > byLength && this.length - byLength > this.lenRange.min
  }

  public shrink(len: number) {
    this.conf.length -= len
  }

  static iteratePosition(noteMap: SequenceNoteMap, cb: (position: number) => void) {
    Object.keys(noteMap)
      .map((p) => parseInt(p))
      .forEach(cb)
  }

  static iterateNotesAtPosition(
    noteMap: SequenceNoteMap,
    cb: (notes: Note[], position: number) => void
  ) {
    Object.keys(noteMap)
      .map((p) => parseInt(p))
      .forEach((p) => cb(noteMap[p], p))
  }

  static iterateEachNote(noteMap: SequenceNoteMap, cb: (note: Note, position: number) => void) {
    Sequence.iterateNotesAtPosition(noteMap, (notesAtPos, position) =>
      notesAtPos.forEach((note) => cb(note, position))
    )
  }

  public iteratePosition(cb: (position: number) => void) {
    Sequence.iteratePosition(this.notes, cb)
  }

  public iterateNotesAtPosition(cb: (notes: Note[], position: number) => void) {
    Sequence.iterateNotesAtPosition(this.notes, cb)
  }

  public iterateEachNote(cb: (note: Note, position: number) => void) {
    Sequence.iterateEachNote(this.notes, cb)
  }
}
