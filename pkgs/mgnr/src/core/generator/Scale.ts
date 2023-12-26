import Logger from 'js-logger'
import { random, randomIntBetween } from '../../utils/calc'
import { NumRange } from '../../utils/primitives'
import { Range } from '../../utils/types'
import { Modulation } from './Modulation'
import {
  Degree,
  HIGHEST_MIDI_NUM,
  LOWEST_MIDI_NUM,
  MidiNum,
  OCTAVE,
  PitchName,
  ROOT_TONE_MAP,
  SCALES,
  ScaleType,
  Semitone,
  SemitonesInScale,
  WHOLE_OCTAVES,
} from './constants'
import { convertDegreeToSemitone } from './convert'

export interface ScaleConf {
  key: PitchName
  pref: ScaleType
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
  get scaleType(): ScaleType {
    return this._conf.pref
  }

  /**
   * possible pitches in the current key.
   * typically use this for harmonizer
   */
  get wholePitches() {
    return this._wholePitches
  }
  private _wholePitches!: MidiNum[]

  /**
   * ranged pitches in the whole pitches.
   * client picks pitches from this pool
   */
  get primaryPitches(): MidiNum[] {
    return this._primaryPitches
  }
  private _primaryPitches!: MidiNum[]

  /**
   * range of the pitches applied to primaryPitches
   */
  get pitchRange(): Range {
    return this._conf.range
  }

  /**
   * root tone midi number
   */
  get lowestPitch() {
    return ROOT_TONE_MAP[this.key]
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
   * call this method every time the config/key changes
   */
  private construct(degreeList: SemitonesInScale) {
    if (!degreeList.length) {
      throw Error(`constructNotes called without degreeList`)
    }
    this._wholePitches = this.constructWholePitches(degreeList)
    this._primaryPitches = this.constructPrimaryPitches()
  }

  private constructWholePitches(degreeList: SemitonesInScale): MidiNum[] {
    const pitches: MidiNum[] = []
    for (let o = 0; o < WHOLE_OCTAVES; o++) {
      for (const d of degreeList) {
        pitches.push(this.lowestPitch + o * OCTAVE + d)
      }
    }
    return pitches
  }

  private constructPrimaryPitches(): MidiNum[] {
    if (!this._wholePitches.length) {
      throw Error(`constructPrimaryPitches called with empty wholePitches`)
    }
    const range = new NumRange(this.pitchRange)
    return this._wholePitches.filter((p) => range.includes(p)).slice()
  }

  private subRange(range: NumRange): MidiNum[] {
    if (!range.within(this.pitchRange)) {
      Logger.warn(`subRange must be specified within current scale's range`)
      return this.primaryPitches
    }
    return this.primaryPitches.filter((n) => range.includes(n)).slice()
  }

  public pickRandomPitch(): number | undefined {
    if (!this.primaryPitches.length) return
    const i = randomIntBetween(0, this.primaryPitches.length)
    return this.primaryPitches[i]
  }

  /**
   * look for the first Nth degree note in the scale
   *
   * @param degree Nth degree from the current key root
   * @param range search scope
   * @returns note's midi number
   */
  public pickNthDegree(degree: Semitone | Degree, range?: Range): MidiNum | undefined {
    const notes = !range ? this.primaryPitches : this.subRange(new NumRange(range))
    return notes.find((n) => this.isNthDegree(n, degree))
  }

  private isNthDegree(semitone: number, degree: number | Degree): boolean {
    const d = typeof degree !== 'number' ? convertDegreeToSemitone(degree) : degree % OCTAVE
    return this.getDegreeInScale(semitone) === d
  }

  private getDegreeInScale(pitch: number): Semitone {
    return (pitch - this.lowestPitch) % OCTAVE
  }

  /**
   * look for nearest note in the pitches.
   * search direction is bidirectional by default
   */
  public pickNearestPitch(pitch: MidiNum, d: 'up' | 'down' | 'bi' = 'bi'): MidiNum {
    const lookup: ('up' | 'down')[] =
      d !== 'bi' ? [d] : random(0.5) ? ['up', 'down'] : ['down', 'up']
    let n = 1
    while (n < OCTAVE * 2) {
      for (const l of lookup) {
        if (l === 'up') {
          const found = this.primaryPitches.find((note) => note === pitch + n)
          if (found) return found
        }
        if (l === 'down') {
          const found = this.primaryPitches.find((note) => note === pitch - n)
          if (found) return found
        }
      }
      n += 1
    }
    Logger.warn(`couldn't find note. returning as is`)
    return pitch
  }

  //-------------------
  // Modulation
  //-------------------

  private _modulation?: Modulation | undefined
  get inModulation(): boolean {
    return this._modulation !== undefined
  }

  /**
   * modulate scale musically.
   * it compares current scale and desired scale and gradually shift towards it
   *
   * @param values config for the next destination scale
   * @param stages number of swap iterations to complete the transition
   */
  public modulate(values: Partial<ScaleConf> = {}, stages = 0) {
    if (!this._modulation) {
      this.initiateModulation(values, stages)
    } else {
      const nextDegreeList = this._modulation.next()
      this.construct(nextDegreeList)
      if (this._modulation.queue.length === 0) {
        this.endModulation(this._modulation.nextScaleConf)
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
