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
    return n.pitch !== 'random' && !this.scale.primaryPitches.includes(n.pitch)
  }

  private getVel(): Note['vel'] {
    return this.conf.veloPref === 'randomPerEach' ? this.conf.noteVel : pickRange(this.conf.noteVel)
  }

  public pickNote(): Note | undefined {
    if (this.conf.fillStrategy === 'random') {
      return {
        pitch: 'random',
        dur: this.conf.noteDur,
        vel: this.getVel(),
      }
    } else {
      const pitch = this.scale.pickRandomPitch()
      if (!pitch) return
      return {
        pitch,
        dur: pickRange(this.conf.noteDur),
        vel: this.getVel(),
      }
    }
  }

  public pickHarmonizedNotes(): Note[] | undefined {
    const n = this.pickNote()
    if (!n) return
    if (!this.harmonizeEnabled) {
      return [n]
    }
    return [n, ...this.harmonizeNote(n)]
  }

  public harmonizeNote(note: Note): Note[] {
    if (!this.harmonizer) {
      Logger.warn(`harmonizer is not set for this picker`)
      return []
    }
    return this.harmonizer.harmonize(note, this.scale.wholePitches)
  }

  public adjustNotePitch(n: Note, d?: 'up' | 'down' | 'bi') {
    if (this.conf.fillStrategy !== 'fixed') {
      n.pitch = this.scale.pickNearestPitch(n.pitch as number, d)
    } else {
      n.pitch = this.getRandomPitch() || n.pitch
    }
  }

  public changeNotePitch(n: Note) {
    n.pitch = this.getRandomPitch(n.pitch) || n.pitch
  }

  private getRandomPitch(originalPitch?: Note['pitch'], r = 0): number | null {
    if (r > 20) {
      Logger.warn(`recursion exceeded at getRandomPitch`)
      return null
    }
    const newPitch = this.scale.pickRandomPitch()
    if (!newPitch || originalPitch === newPitch) {
      return this.getRandomPitch(originalPitch, r + 1)
    }
    return newPitch
  }
}
