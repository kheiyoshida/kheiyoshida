import Logger from 'js-logger'
import { buildConf } from '../../utils/utils'
import { Note } from './Note'
import { Degree, MidiNum, OCTAVE, Semitone } from './constants'
import { convertDegreeToSemitone } from './convert'

export type HarmonizerConf = {
  degree: (Degree | Semitone)[]
  force?: boolean
  lookDown?: boolean
}

export class Harmonizer {
  private conf: HarmonizerConf

  constructor(conf: Partial<HarmonizerConf>) {
    this.conf = buildConf(Harmonizer.getDefaultConf(), conf)
  }

  static getDefaultConf(): HarmonizerConf {
    return {
      degree: [],
      force: false,
      lookDown: false,
    }
  }

  /**
   * harmonize note's pitch.
   * @param note original note
   * @param wholePitches available pitches in the scale
   */
  public harmonize(note: Note, wholePitches: Semitone[]): Note[] {
    return this.conf.degree
      .map((d) => this._harmonize(note, d, wholePitches))
      .filter((n): n is Note => n !== undefined)
  }

  private _harmonize(note: Note, degree: Degree | Semitone, pitches: Semitone[]): Note | undefined {
    if (note.pitch === 'random') {
      Logger.info(`random harmonize`)
      return note
    }
    const semiDeg = convertDegreeToSemitone(degree)
    if (this.conf.force) {
      const pitch = this.getPitch(note.pitch, semiDeg)
      return { ...note, pitch }
    } else {
      const pitch = this.lookupHarmonicPitch(note.pitch, semiDeg, pitches)
      if (pitch !== undefined) {
        return { ...note, pitch }
      }
    }
  }

  /**
   * recursively look up harmonic pitch in the scale's pitches.
   * note that it tries to look up nearest pitch if there's none matching.
   *
   * @param rootPitch original pitch of provided note
   * @param degree degree in semitone
   * @param pitches scale's pitch list
   * @returns harmonized pitch
   */
  private lookupHarmonicPitch(
    rootPitch: number,
    degree: Semitone,
    pitches: Semitone[],
    r = 0
  ): MidiNum | undefined {
    if (r > OCTAVE) {
      Logger.warn(`could not find harmonized pitch: ${rootPitch} ${pitches}`)
      return
    }
    const p = this.getPitch(rootPitch, degree)
    if (pitches.includes(p)) {
      return p
    } else {
      return this.lookupHarmonicPitch(rootPitch, degree + 1, pitches, r + 1)
    }
  }

  /**
   * add/subtract pitch
   */
  private getPitch(pitch: MidiNum, semi: Semitone) {
    return this.conf.lookDown ? pitch - semi : pitch + semi
  }
}
