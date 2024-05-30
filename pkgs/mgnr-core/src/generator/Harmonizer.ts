import { overrideDefault } from 'utils'
import { Note } from './Note'
import { Degree, MidiNum, OCTAVE, Semitone } from './constants'
import { convertDegreeToSemitone } from './convert'

export type HarmonizerConf = {
  degree: (Degree | Semitone)[]
  force: boolean
  lookDown: boolean
}

export class Harmonizer {
  private conf: HarmonizerConf
  constructor(conf: Partial<HarmonizerConf>) {
    this.conf = overrideDefault(Harmonizer.getDefaultConf(), conf)
  }
  static getDefaultConf(): HarmonizerConf {
    return {
      degree: [],
      force: false,
      lookDown: false,
    }
  }
  public harmonize(note: Note, wholePitches: Semitone[]): Note[] {
    return harmonize(note, wholePitches, this.conf)
  }
}

export function harmonize(note: Note, wholePitches: Semitone[], conf: Partial<HarmonizerConf>): Note[] {
  const fullconf = overrideDefault(Harmonizer.getDefaultConf(), conf)
  if (note.pitch === 'random') return [note]
  return fullconf.degree
    .map((d) =>
      getHarmonicPitch(fullconf, note.pitch as number, convertDegreeToSemitone(d), wholePitches)
    )
    .filter((n): n is number => n !== null)
    .map((harmonicPitch) => ({ ...note, pitch: harmonicPitch }))
}

const getHarmonicPitch = (
  conf: HarmonizerConf,
  originalPitch: Semitone,
  distance: Semitone,
  pitches: Semitone[]
): number | null => {
  if (conf.force) return getPitchInDistance(originalPitch, distance, conf.lookDown)
  else return lookupHarmonicPitch(originalPitch, distance, pitches, conf.lookDown)
}

function lookupHarmonicPitch(
  rootPitch: number,
  degree: Semitone,
  pitches: Semitone[],
  lookDown: boolean,
  r = 0
): MidiNum | null {
  if (r > OCTAVE) return null
  const p = getPitchInDistance(rootPitch, degree, lookDown)
  if (pitches.includes(p)) return p
  else return lookupHarmonicPitch(rootPitch, degree + 1, pitches, lookDown, r + 1)
}

function getPitchInDistance(pitch: MidiNum, distance: Semitone, lookDown: boolean) {
  return pitch + (lookDown ? -distance : distance)
}
