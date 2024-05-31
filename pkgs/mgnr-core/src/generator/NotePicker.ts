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

export const fillNoteConf = (provided: Partial<NotePickerConf>): NotePickerConf => {
  return overrideDefault(getDefaultConf(), provided)
}

const getDefaultConf = (): NotePickerConf => ({
  noteDur: 1,
  noteVel: 100,
  veloPref: 'randomPerEach',
  fillStrategy: 'fill',
})

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

export function harmonizeNote(note: Note, conf: PitchConf, scale: Scale): Note[] {
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
