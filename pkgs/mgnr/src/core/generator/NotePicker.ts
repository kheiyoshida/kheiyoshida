import Logger from 'js-logger'
import { pickRange } from 'utils'
import { Range } from '../../utils/types'
import { buildConf } from '../../utils/utils'
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
  private _conf: NotePickerConf
  get conf(): NotePickerConf {
    return this._conf
  }

  readonly scale: Scale

  private harmonizer: Harmonizer | undefined
  get harmonizeEnabled() {
    return this.harmonizer !== undefined
  }

  constructor(conf: Partial<NotePickerConf> = {}, scale?: Scale) {
    if (conf.harmonizer) {
      this.harmonizer = new Harmonizer(conf.harmonizer)
    }
    this._conf = buildConf(NotePicker.getDefaultConf(), conf)
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

  public updateConfig(conf: Partial<NotePickerConf>) {
    this._conf = buildConf(this._conf, conf)
  }

  public pickHarmonizedNotes(): Note[] | undefined {
    const n = this.pickNote()
    if (!n) return
    if (!this.harmonizeEnabled) {
      return [n]
    }
    return [n, ...this.harmonizeNote(n)]
  }

  public pickNote(): Note | undefined {
    if (this._conf.fillStrategy === 'random') {
      return this.pickRandomNote()
    } else {
      const pitch = this.scale.pickRandomPitch()
      if (pitch) return this.pickConcreteNote(pitch)
    }
  }

  private pickRandomNote(): Note {
    return {
      pitch: 'random',
      dur: this._conf.noteDur,
      vel: this.getNoteVelocity(),
    }
  }

  private pickConcreteNote(pitch: number): Note {
    return {
      pitch,
      dur: pickRange(this._conf.noteDur),
      vel: this.getNoteVelocity(),
    }
  }

  private getNoteVelocity(): Note['vel'] {
    return this._conf.veloPref === 'randomPerEach' ? this._conf.noteVel : pickRange(this._conf.noteVel)
  }

  public harmonizeNote(note: Note): Note[] {
    if (!this.harmonizer) {
      Logger.warn(`harmonizer is not set for this picker`)
      return []
    }
    return this.harmonizer.harmonize(note, this.scale.wholePitches)
  }

  public adjustNotePitch(n: Note, d?: 'up' | 'down' | 'bi'): void {
    if (this.checkStaleNote(n)) return
    if (this._conf.fillStrategy !== 'fixed') {
      n.pitch = this.scale.pickNearestPitch(n.pitch as number, d)
    } else {
      this.changeNotePitch(n)
    }
  }

  private checkStaleNote(n: Note): boolean {
    if (n.pitch === 'random') return true
    return this.scale.primaryPitches.includes(n.pitch)
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
