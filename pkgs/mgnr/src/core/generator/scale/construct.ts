import { NumRange } from '../../../utils/primitives'
import { Range } from '../../../utils/types'
import {
  MidiNum,
  OCTAVE,
  ROOT_TONE_MAP,
  SCALES,
  SemitonesInScale,
  WHOLE_OCTAVES,
} from '../constants'
import { ScaleConf } from './Scale'

export function constructScalePitchesFromConf(conf: ScaleConf) {
  return constructScalePitches(SCALES[conf.pref], ROOT_TONE_MAP[conf.key], conf.range)
}

export function constructScalePitches(degreeList: SemitonesInScale, lowestPitch: number, pitchRange: Range) {
  if (!degreeList.length) {
    throw Error(`constructNotes called without degreeList`)
  }
  const wholePitches = constructWholePitches(degreeList, lowestPitch)
  const primaryPitches = constructPrimaryPitches(wholePitches, pitchRange)
  return { wholePitches, primaryPitches }
}

function constructWholePitches(degreeList: SemitonesInScale, lowestPitch: number) {
  const pitches: MidiNum[] = []
  for (let octave = 0; octave < WHOLE_OCTAVES; octave++) {
    for (const degree of degreeList) {
      pitches.push(lowestPitch + octave * OCTAVE + degree)
    }
  }
  return pitches
}

function constructPrimaryPitches(wholePitches: number[], pitchRange: Range) {
  if (!wholePitches.length) {
    throw Error(`constructPrimaryPitches called with empty wholePitches`)
  }
  const range = new NumRange(pitchRange)
  return wholePitches.filter((p) => range.includes(p)).slice()
}
