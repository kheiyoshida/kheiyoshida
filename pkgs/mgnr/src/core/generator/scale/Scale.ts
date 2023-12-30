import Logger from 'js-logger'
import { randomItemFromArray } from 'utils'
import { random } from '../../../utils/calc'
import { NumRange } from '../../../utils/primitives'
import { Range } from '../../../utils/types'
import {
  Degree,
  MidiNum,
  OCTAVE,
  PitchName,
  ROOT_TONE_MAP,
  ScaleType,
  Semitone,
} from '../constants'
import { convertDegreeToSemitone } from '../convert'
import { Modulation } from './Modulation'
import { constructScalePitches, constructScalePitchesFromConf } from './construct'
import {
  EmptyScaleError,
  validateScaleRange,
  validateModResult,
  validateModulationConf,
  validateScalePitches,
} from './validate'

export interface ScaleConf {
  key: PitchName
  pref: ScaleType
  range: Range
}

export type ScaleArgs = Partial<ScaleConf>

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
   * suggests that scale has no pitches
   * (typically temporarily during modulation)
   */
  get isEmpty(): boolean {
    return this._primaryPitches.length === 0
  }

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
      range: validateScaleRange(values.range || fallback.range),
    }
  }

  constructor(values: Partial<ScaleConf> = {}) {
    const conf = this.buildConf(values)
    const result = constructScalePitchesFromConf(conf)
    validateScalePitches(result, conf)
    this.setNewValues(result.wholePitches, result.primaryPitches, conf)
  }

  private setNewValues(wholePitches: MidiNum[], primaryPitches: MidiNum[], conf: ScaleConf) {
    this._conf = conf
    this._wholePitches = wholePitches
    this._primaryPitches = primaryPitches
  }

  public pickRandomPitch(): MidiNum {
    return randomItemFromArray(this.primaryPitches)
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

  private subRange(range: NumRange): MidiNum[] {
    if (!range.within(this.pitchRange)) {
      Logger.warn(`subRange must be specified within current scale's range`)
      return this.primaryPitches
    }
    return this.primaryPitches.filter((n) => range.includes(n)).slice()
  }

  private isNthDegree(semitone: number, degree: number | Degree): boolean {
    const deg = typeof degree !== 'number' ? convertDegreeToSemitone(degree) : degree % OCTAVE
    return this.getSemitoneDegreeInScale(semitone) === deg
  }

  private getSemitoneDegreeInScale(pitch: number): Semitone {
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
  public modulate(values?: Partial<ScaleConf>, stages = 0): void {
    if (!this._modulation) {
      if (!values) return
      this.initiateModulation(values, stages)
    } else {
      const nextDegreeList = this._modulation.next()
      const { wholePitches, primaryPitches } = constructScalePitches(
        nextDegreeList,
        this.lowestPitch,
        this.pitchRange
      )
      if (!validateModResult({ wholePitches, primaryPitches }, this._modulation)) {
        if (this._modulation.queue.length) return this.modulate()
        else {
          Logger.error(`unexpected empty modulation. generously aborting the process...`)
          this._modulation = undefined
          return this.modulateImmediately(this._conf)
        }
      }
      this.setNewValues(wholePitches, primaryPitches, this._conf)
      if (this._modulation.queue.length === 0) {
        this.endModulation(this._modulation.nextScaleConf)
      }
    }
  }

  private initiateModulation(values: Partial<ScaleConf>, stages = 0) {
    const conf = this.buildConf(values)
    if (stages < 2) return this.modulateImmediately(conf)
    if (!validateModulationConf(conf)) {
      Logger.warn(`aborted modulation due to the invalid config`)
      return
    }
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

  private modulateImmediately(conf: ScaleConf) {
    try {
      const { wholePitches, primaryPitches } = constructScalePitchesFromConf(conf)
      validateScalePitches({ wholePitches, primaryPitches }, conf)
      this.setNewValues(wholePitches, primaryPitches, conf)
    } catch (e) {
      if (e instanceof EmptyScaleError) {
        return
      }
      throw e
    }
  }

  private endModulation(conf: ScaleConf) {
    this._conf = conf
    this._modulation = undefined
  }
}
