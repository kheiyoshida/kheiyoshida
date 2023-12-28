import Logger from 'js-logger'
import { randomItemFromArray } from 'utils'
import { random } from '../../utils/calc'
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
    const conf = this.buildConf(values)
    const result = constructFromConf(conf)
    validateResult(result, conf)
    this.setNewValues(result.wholePitches, result.primaryPitches, conf)
  }

  private setNewValues(wholePitches: MidiNum[], primaryPitches: MidiNum[], conf: ScaleConf) {
    this._conf = conf
    this._wholePitches = wholePitches
    this._primaryPitches = primaryPitches
  }

  private subRange(range: NumRange): MidiNum[] {
    if (!range.within(this.pitchRange)) {
      Logger.warn(`subRange must be specified within current scale's range`)
      return this.primaryPitches
    }
    return this.primaryPitches.filter((n) => range.includes(n)).slice()
  }

  public pickRandomPitch(): MidiNum | undefined {
    if (this.primaryPitches.length === 0) {
      throw Error(`scale is empty ${JSON.stringify(this._conf, null, 2)}`)
    }
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

  private isNthDegree(semitone: number, degree: number | Degree): boolean {
    const d = typeof degree !== 'number' ? convertDegreeToSemitone(degree) : degree % OCTAVE
    return this.getSemitoneDegreeInScale(semitone) === d
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
      const { wholePitches, primaryPitches } = _construct(
        nextDegreeList,
        this.lowestPitch,
        this.pitchRange
      )
      if (!this.validateModResult({ wholePitches, primaryPitches }, this._modulation)) {
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
    if (!this.validateNextConf(conf)) {
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

  private validateNextConf(conf: ScaleConf) {
    try {
      const result = constructFromConf(conf)
      validateResult(result, conf)
      return true
    } catch (e) {
      if (e instanceof EmptyScaleError) return false
      throw e
    }
  }

  private validateModResult(result: ReturnType<typeof _construct>, mod: Modulation) {
    try {
      validateResult(result, mod.nextScaleConf)
      return true
    } catch (e) {
      if (e instanceof EmptyScaleError) return false
      throw e
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
      const { wholePitches, primaryPitches } = constructFromConf(conf)
      validateResult({ wholePitches, primaryPitches }, conf)
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

class EmptyScaleError extends Error {
  constructor(config: ScaleConf) {
    super(`unexpected empty scale. Is the new config valid?: ${JSON.stringify(config, null, 2)}`)
  }
}

function constructFromConf(conf: ScaleConf) {
  return _construct(SCALES[conf.pref], ROOT_TONE_MAP[conf.key], conf.range)
}

export function validateResult(result: ReturnType<typeof _construct>, conf: ScaleConf): void {
  if (result.wholePitches.length === 0 || result.primaryPitches.length === 0) {
    throw new EmptyScaleError(conf)
  }
}

function _construct(degreeList: SemitonesInScale, lowestPitch: number, pitchRange: Range) {
  if (!degreeList.length) {
    throw Error(`constructNotes called without degreeList`)
  }
  const wholePitches = _constructWholePitches(degreeList, lowestPitch)
  const primaryPitches = _constructPrimaryPitches(wholePitches, pitchRange)
  return { wholePitches, primaryPitches }
}

function _constructWholePitches(degreeList: SemitonesInScale, lowestPitch: number) {
  const pitches: MidiNum[] = []
  for (let octave = 0; octave < WHOLE_OCTAVES; octave++) {
    for (const degree of degreeList) {
      pitches.push(lowestPitch + octave * OCTAVE + degree)
    }
  }
  return pitches
}

function _constructPrimaryPitches(wholePitches: number[], pitchRange: Range) {
  if (!wholePitches.length) {
    throw Error(`constructPrimaryPitches called with empty wholePitches`)
  }
  const range = new NumRange(pitchRange)
  return wholePitches.filter((p) => range.includes(p)).slice()
}
