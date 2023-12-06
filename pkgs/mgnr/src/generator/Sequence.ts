import Logger from 'js-logger'
import { randomIntBetween } from '../utils/calc'
import { Range } from '../utils/types'
import { buildConf, normalizeRange } from '../utils/utils'
import { Note } from './Note'

type SeqDivision = 16 | 8 | 4 | 2 | 1

export type SequenceNotesConf = {
  length: number
  lenRange: Range
  density: number
  division: SeqDivision
  fillPref: 'mono' | 'allowPoly'
}

/**
 * data map for notes on each position.
 * notes can be set in the same position as array
 */
export type SeqNotes = {
  [pos: number]: Note[]
}

export class Sequence {
  private _notes!: SeqNotes
  public get notes(): SeqNotes {
    return this._notes
  }

  readonly conf: SequenceNotesConf

  /**
   * length of the sequence
   */
  get length(): number {
    return this.conf.length
  }

  /**
   * min/max for length. affects extend/shrink
   */
  get lenRange() {
    return this.conf.lenRange
  }

  /**
   * note division per 1 measure
   */
  get division() {
    return this.conf.division
  }

  /**
   * density of the notes
   */
  get density() {
    return this.conf.density
  }

  /**
   * number of measures for a loop of sequence.
   * e.g. length20 / division16 = 1.25 measures
   */
  get lengthInMeasure(): number {
    return this.length / this.division
  }

  get maxNumOfNotes() {
    return Math.floor(this.length * this.density)
  }

  get availableSpace() {
    return this.maxNumOfNotes - this.used
  }

  /**
   * currently used space in the sequence
   */
  get used() {
    let used = 0
    for (const notes of Object.values(this.notes)) {
      used += notes.reduce((p, c) => Math.max(p, normalizeRange(c.dur)), 0)
    }
    return used
  }

  /**
   * actual number of note objects
   */
  get numOfNotes() {
    let num = 0
    this.iterate((_) => (num += 1))
    return num
  }

  get isEmpty() {
    return this.numOfNotes === 0
  }

  static DefaultConf: SequenceNotesConf = {
    length: 16,
    lenRange: {
      min: 2,
      max: 50,
    },
    division: 16,
    density: 0.5,
    fillPref: 'allowPoly',
  }

  constructor(conf: Partial<SequenceNotesConf> = {}) {
    this.conf = buildConf(Sequence.DefaultConf, conf)
  }

  public assignNote(pos: number | undefined, note: Note) {
    if (pos !== undefined) {
      if (this.notes[pos]) {
        this.notes[pos].push(note)
      } else {
        this.notes[pos] = [note]
      }
    }
  }

  public assignNotes(pos: number | undefined, notes: Note[]) {
    for(const n of notes) {
      this.assignNote(pos, n)
    }
  }

  /**
   * delete old data an dreplace entire notes object. 
   */
  public replaceEntireNotes(notes: SeqNotes) {
    this._notes = notes
  }

  public replaceNotes(pos: number, notes: Note[]) {
    if (!notes || !notes.length) {
      throw Error(`replaceNotes called with empty notes`)
    }
    this.notes[pos] = notes
  }

  public deletePosition(p: number) {
    if (this.notes[p]) {
      delete this.notes[p]
    }
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

  public clearNotes() {
    this._notes = {}
  }

  /**
   * iterate over note positions
   * @param cb
   */
  public iteratePos(cb: (pos: number) => void) {
    Object.keys(this.notes)
      .map((p) => parseInt(p))
      .forEach(cb)
  }

  /**
   * Iterate on each note
   * @param cb
   */
  public iterate(cb: (notes: Note, pos: number) => void) {
    this.iteratePos((p) => this.notes[p].forEach((note) => cb(note, p)))
  }
}
