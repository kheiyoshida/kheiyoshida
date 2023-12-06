import { random, randomIntBetween } from '../utils/calc'
import {
  Degree,
  OCTAVE,
  ROOT_TONE,
  PitchName,
  ScalePref,
  SCALES,
  MidiNum,
  DegreeNumList,
  LOWEST_MIDI_NUM,
  HIGHEST_MIDI_NUM,
  Semitone,
  WHOLE_OCTAVES,
} from './constants'
import { deg2semi } from './convert'
import { NumRange } from '../utils/primitives'
import { Range } from '../utils/types'
import Logger from 'js-logger'
import { Modulation } from './Modulation'

export interface ScaleConf {
  key: PitchName
  pref: ScalePref
  range: Range
}

export type ScaleArgs = Partial<ScaleConf>

/**
 * responsible for providing note pool for `Sequence`.
 * construct note pool from provided config.
 * can alter itself by invoking `modulate` with destination config
 */
export class Scale {
  private _conf!: ScaleConf

  /**
   * root tone name of the scale.
   */
  get key(): PitchName {
    return this._conf.key
  }

  /**
   * prefered degree in the key
   */
  get pref(): ScalePref {
    return this._conf.pref
  }

  /**
   * range of the note pool
   */
  get range(): Range {
    return this._conf.range
  }

  /**
   * possible pitches in the current key. 
   */
  private _wholePitches!: MidiNum[]

  /**
   * possible pitches in the current key.
   * typically use this for harmonizer
   */
  get wholePitches() {
    return this._wholePitches
  }

  /**
   * ranged pitches in the whole pitches.
   * clients usually pick pitch from this pool
   */
  private _primaryPitches!: MidiNum[]

  /**
   * pitch list
   */
  get pitches(): MidiNum[] {
    return this._primaryPitches
  }

  /**
   * root tone midi number (in the lowest)
   */
  get root() {
    return ROOT_TONE[this.key]
  }

  static DefaultValue: ScaleConf = {
    key: 'C',
    range: { min: 24, max: 120 },
    pref: 'major',
  }

  private buildConf(values: ScaleArgs): ScaleConf {
    const fallback = this._conf || Scale.DefaultValue
    return {
      key: values.key || fallback.key,
      pref: values.pref || fallback.pref,
      range: this.sanitizeRange(values.range || fallback.range),
    }
  }

  private sanitizeRange(range: Range): NumRange {
    return NumRange.clamp(
      range,
      {
        min: LOWEST_MIDI_NUM,
        max: HIGHEST_MIDI_NUM,
      },
      `Scale.range should be between ${LOWEST_MIDI_NUM} - ${HIGHEST_MIDI_NUM}`
    )
  }

  constructor(values: Partial<ScaleConf> = {}) {
    this.init(this.buildConf(values))
  }

  private init(conf: ScaleConf) {
    this._conf = conf
    this.construct(SCALES[conf.pref])
  }

  /**
   * build the pitch lists based on degreeList and configured range.
   * call this method every time the config/key changes
   */
  private construct(degreeList: DegreeNumList) {
    if (!degreeList.length) {
      throw Error(`constructNotes called without degreeList`)
    }
    this._wholePitches = this.constructWholePitches(degreeList)
    this._primaryPitches = this.constructPrimaryPitches()
  }

  private constructWholePitches(degreeList: DegreeNumList):MidiNum[] {
    const pitches: MidiNum[] = []
    for (let o = 0; o < WHOLE_OCTAVES; o++) {
      for (const d of degreeList) {
        pitches.push(this.root + o * OCTAVE + d)
      }
    }
    return pitches
  }

  private constructPrimaryPitches():MidiNum[] {
    if (!this._wholePitches.length) {
      throw Error(`constructPrimaryPitches called with empty wholePitches`)
    }
    const range = new NumRange(this.range)
    return this._wholePitches.filter((p) => range.includes(p)).slice()
  }

  private subRange(range: NumRange): MidiNum[] {
    if (!range.within(this.range)) {
      Logger.warn(`subRange must be specified within current scale's range`)
      return this.pitches
    }
    return this.pitches.filter((n) => range.includes(n)).slice()
  }

  /**
   * pick random note in the current notes pool
   */
  public pickRandom() {
    const i = randomIntBetween(0, this.pitches.length)
    return this.pitches[i]
  }

  /**
   * look for the first Nth degree note in the scale
   * doesn't return if not any
   *
   * @param degree Nth degree from the current key root
   * @param range search scope
   * @returns note's midi number
   */
  public pickNthDegree(
    degree: Semitone | Degree,
    range?: Range
  ): MidiNum | undefined {
    const notes = !range ? this.pitches : this.subRange(new NumRange(range))
    return notes.find((n) => this.isNthDegree(n, degree))
  }

  /**
   * examine note's degree
   * @param semitone
   * @param degree
   * @returns result
   */
  private isNthDegree(semitone: number, degree: number | Degree): boolean {
    const d = typeof degree !== 'number' ? deg2semi(degree) : degree % OCTAVE
    return this.getDegreeInScale(semitone) === d
  }

  /**
   * @param pitch note to examine
   * @returns note's degree in this scale
   */
  private getDegreeInScale(pitch: number): Semitone {
    return (pitch - this.root) % OCTAVE
  }

  /**
   * look for nearest note in the notes to the provided note
   * search direction is bidirectional by default
   *
   * @param num note's midi number
   * @param d
   * @returns
   */
  public pickNearestPitch(
    num: MidiNum,
    d: 'up' | 'down' | 'bi' = 'bi'
  ): MidiNum {
    const lookup: ('up' | 'down')[] =
      d !== 'bi' ? [d] : random(0.5) ? ['up', 'down'] : ['down', 'up']
    let n = 1
    while (n < OCTAVE * 2) {
      for (const l of lookup) {
        if (l === 'up') {
          const found = this.pitches.find((note) => note === num + n)
          if (found) return found
        }
        if (l === 'down') {
          const found = this.pitches.find((note) => note === num - n)
          if (found) return found
        }
      }
      n += 1
    }
    throw Error(`couldn't find note`)
  }

  //-------------------
  // Modulation
  //-------------------

  /**
   * spec for next modulation operation
   */
  private _modulation?: Modulation | undefined
  get inModulation(): boolean {
    return this._modulation !== undefined
  }

  /**
   * modulate scale musically.
   * it compares current scale and desired scale and gradually shift towards it
   *
   * @param values config for the next destination scale
   * @param stages number of swap event required to complete the transition
   */
  public modulate(values: Partial<ScaleConf> = {}, stages = 0) {
    if (!this._modulation) {
      this.initiateModulation(values, stages)
    } else {
      const nextDegreeList = this._modulation.next()
      this.construct(nextDegreeList)
      if (this._modulation.queue.length === 0) {
        this.endModulation(this._modulation.conf)
      }
    }
  }

  private initiateModulation(values: Partial<ScaleConf>, stages = 0) {
    Logger.debug('initiate modulation: ', values)
    if (stages < 2) return this.modulateImmediately(values)
    const conf = this.buildConf(values)
    const hasSet = this.setModulation(conf, stages)
    if (!hasSet) {
      this.endModulation(conf)
    } else {
      this.modulate()
    }
  }

  private setModulation(conf: ScaleConf, stages: number) {
    const modulation = Modulation.create(this._conf, conf, stages)
    if (modulation) {
      this._modulation = modulation
      return true
    }
  }

  private modulateImmediately(values: Partial<ScaleConf>) {
    this.init(this.buildConf(values))
  }

  private endModulation(conf: ScaleConf) {
    this._conf = conf
    this._modulation = undefined
  }
}
