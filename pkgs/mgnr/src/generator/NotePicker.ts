import Logger from 'js-logger'
import { pickRange } from '../utils/calc'
import { Range } from '../utils/types'
import { buildConf } from '../utils/utils'
import { Harmonizer, HarmonizerConf } from './Harmonizer'
import { Note } from './Note'
import { Scale } from './Scale'

export type NotePickerConf = {
  noteDur: number | Range
  noteVel: number | Range
  veloPref: 'randomPerEach' | 'consistent'
  fillStrategy: 'random' | 'fill' | 'fixed'
  harmonizer?: HarmonizerConf
}

export class NotePicker {
  readonly conf: NotePickerConf

  readonly scale: Scale

  private harmonizer: Harmonizer | undefined
  get harmonizeEnabled() {
    return this.harmonizer !== undefined
  }

  constructor(conf: Partial<NotePickerConf>, scale?: Scale) {
    if (conf.harmonizer) {
      this.harmonizer = new Harmonizer(conf.harmonizer)
    }
    this.conf = buildConf(NotePicker.getDefaultConf(), conf)
    this.scale = scale || new Scale({ key: 'C', range: { min: 24, max: 120 } })
  }
  static getDefaultConf(): NotePickerConf {
    return {
      noteDur: 1,
      noteVel: 100,
      veloPref: 'randomPerEach',
      fillStrategy: 'fill',
    }
  }

  /**
   * Check if a note is in the current scale's note pool
   */
  public checkStaleNote(n: Note): boolean {
    return n.pitch !== 'random' && !this.scale.pitches.includes(n.pitch)
  }

  private getVel(): Note['vel'] {
    return this.conf.veloPref === 'randomPerEach'
      ? this.conf.noteVel
      : pickRange(this.conf.noteVel)
  }

  public pick(): Note | undefined {
    if (this.conf.fillStrategy === 'random') {
      return {
        pitch: 'random',
        dur: this.conf.noteDur,
        vel: this.getVel(),
      }
    } else {
      const pitch = this.scale.pickRandom()
      if (!pitch) return
      return {
        pitch,
        dur: pickRange(this.conf.noteDur),
        vel: this.getVel(),
      }
    }
  }

  public pickHarmonized(): Note[] | undefined {
    const n = this.pick()
    if (!n) return
    if (!this.harmonizeEnabled) {
      return [n]
    }
    return [n, ...this.harmonize(n)]
  }

  /**
   * harmonize note's pitch.
   * @param note original note
   */
  public harmonize(note: Note): Note[] {
    if (!this.harmonizer) {
      Logger.warn(`harmonizer is not set for this picker`)
      return []
    }
    return this.harmonizer.harmonize(note, this.scale.wholePitches)
  }

  /**
   * adjust note's pitch to the nearest pitch in the scale
   * typically called when scale modulated
   */
  public adjustNotePitch(n: Note, d?: 'up' | 'down' | 'bi') {
    if (this.conf.fillStrategy !== 'fixed') {
      n.pitch = this.scale.pickNearestPitch(n.pitch as number, d)
    } else {
      n.pitch = this.getRandomPitch() || n.pitch
    }
  }

  /**
   * change note's pitch randomly
   * same pitch should not be assigned
   */
  public changeNotePitch(n: Note) {
    n.pitch = this.getRandomPitch(n.pitch) || n.pitch
  }

  /**
   * Get random pitch from the scale.
   * @param p (optional) if provided, it assures differnt pitch
   */
  private getRandomPitch(p?: Note['pitch'], r = 0): number | null {
    if (r > 20) {
      Logger.warn(`recursion exceeded at getRandomPitch`)
      return null
    }
    const pitch = this.scale.pickRandom()
    if (!pitch || p === pitch) {
      return this.getRandomPitch(p, r + 1)
    }
    return pitch
  }
}
