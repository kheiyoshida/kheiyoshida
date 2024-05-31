import { Range, overrideDefault, pickRange } from 'utils'
import { HarmonizerConf, harmonize } from './Harmonizer'
import { Note } from './Note'
import { Scale } from './scale/Scale'

type VelocityConf = {
  noteVel: number | Range
  veloPref: 'randomPerEach' | 'consistent'
}

type DurationConf = {
  fillStrategy: 'random' | 'fill' | 'fixed'
  noteDur: number | Range
}

type PitchConf = {
  fillStrategy: 'random' | 'fill' | 'fixed'
  harmonizer?: Partial<HarmonizerConf>
}

export type NotePickerConf = VelocityConf & DurationConf & PitchConf

export class NotePicker {
  private _conf: NotePickerConf
  get conf(): NotePickerConf {
    return this._conf
  }

  readonly scale: Scale

  get harmonizeEnabled() {
    return this._conf.harmonizer !== undefined
  }

  constructor(conf: Partial<NotePickerConf> = {}, scale?: Scale) {
    this._conf = overrideDefault(NotePicker.getDefaultConf(), conf)
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
    this._conf = overrideDefault(this._conf, conf)
  }

  public pickHarmonizedNotes(): Note[] | undefined {
    return pickHarmonizedNotes(this.conf, this.scale)
  }

  public pickNote(): Note | undefined {
    return pickNote(this.conf, this.scale)
  }

  public harmonizeNote(note: Note): Note[] {
    return harmonizeNote(note, this._conf, this.scale)
  }

  public adjustNotePitch(n: Note, d?: 'up' | 'down' | 'bi'): void {
    adjustNotePitch(n, this.scale, this._conf, d)
  }

  public changeNotePitch(n: Note): void {
    changeNotePitch(n, this.scale)
  }
}

// Note

export function pickNote(conf: NotePickerConf, scale: Scale): Note | undefined {
  const pitch = getNotePitch(conf, scale)
  if (!pitch) return
  return {
    pitch: pitch,
    dur: getNoteDuration(conf),
    vel: getNoteVelocity(conf),
  }
}

export function pickHarmonizedNotes(conf: NotePickerConf, scale: Scale): Note[] | undefined {
  const n = pickNote(conf, scale)
  if (!n) return
  return [n, ...harmonizeNote(n, conf, scale)]
}

export function harmonizeNote(note: Note, conf: NotePickerConf, scale: Scale): Note[] {
  if (!conf.harmonizer) return []
  return harmonize(note, scale.wholePitches, conf.harmonizer)
}

// Pitch

export function adjustNotePitch(
  n: Note,
  scale: Scale,
  conf: PitchConf,
  d?: 'up' | 'down' | 'bi'
): void {
  if (isIncludedInScale(n.pitch, scale)) return
  if (conf.fillStrategy !== 'fixed') {
    n.pitch = scale.pickNearestPitch(n.pitch as number, d)
  } else {
    changeNotePitch(n, scale)
  }
}

export function changeNotePitch(n: Note, scale: Scale): void {
  if (n.pitch === 'random') return
  n.pitch = getDifferentPitch(scale, n.pitch) || n.pitch
}

function isIncludedInScale(pitch: Note['pitch'], scale: Scale): boolean {
  if (pitch === 'random') return true
  return scale.primaryPitches.includes(pitch)
}

function getNotePitch(conf: PitchConf, scale: Scale): Note['pitch'] | undefined {
  if (conf.fillStrategy === 'random') return 'random'
  else return scale.pickRandomPitch()
}

function getDifferentPitch(scale: Scale, originalPitch: number, r = 0): number {
  if (r > 20) return originalPitch
  const newPitch = scale.pickRandomPitch()
  if (originalPitch !== newPitch && newPitch !== undefined) return newPitch
  return getDifferentPitch(scale, originalPitch, r + 1)
}

// Duration

function getNoteDuration({ noteDur, fillStrategy }: DurationConf): Note['dur'] {
  return fillStrategy === 'random' ? noteDur : pickRange(noteDur)
}

// Velocity

function getNoteVelocity({ veloPref, noteVel }: VelocityConf): Note['vel'] {
  return veloPref === 'randomPerEach' ? noteVel : pickRange(noteVel)
}
