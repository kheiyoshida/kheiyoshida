import { randomIntBetween } from '../../utils/calc'
import {
  Degree,
  DEGREE_NUM_MAP,
  PitchName,
  PITCH_NAMES,
  ScaleType,
  SCALES,
  Semitone,
} from './constants'

export function nthDegreeTone(root: PitchName, degree: Degree): PitchName {
  const degreeInSemitone = DEGREE_NUM_MAP[degree]
  const rootInSemitone = PITCH_NAMES.indexOf(root)
  return PITCH_NAMES[(rootInSemitone + degreeInSemitone) % 12]
}

export function createPitchNameListInScale(key: PitchName, scaleType: ScaleType): PitchName[] {
  const degreeList = SCALES[scaleType]
  const toneList: PitchName[] = []
  const rootIdx = PITCH_NAMES.indexOf(key)
  for (const d of degreeList) {
    const idx = (rootIdx + d) % 12
    toneList.push(PITCH_NAMES[idx])
  }
  return toneList
}

export function getSemitoneDiffBetweenPitches(root: PitchName, compare: PitchName): Semitone {
  const [ri, ci] = [PITCH_NAMES.indexOf(root), PITCH_NAMES.indexOf(compare)]
  return (ci - ri + 12) % 12
}

export function pickRandomPitchName() {
  return PITCH_NAMES[randomIntBetween(0, PITCH_NAMES.length)]
}
