import { randomIntBetween } from '../utils/calc'
import {
  Degree,
  DEGREE_NUM_MAP,
  PitchName,
  PITCH_NAME,
  ScalePref,
  SCALES,
  Semitone,
} from './constants'

/**
 * add degree to a pitch
 * @returns string pitch name
 */
export const nthDegreeTone = (root: PitchName, degree: Degree): PitchName => {
  const d = DEGREE_NUM_MAP[degree]
  const r = PITCH_NAME.indexOf(root)
  return PITCH_NAME[(r + d) % 12]
}

/**
 *
 * @param key
 * @param modePref
 * @returns Readable ToneName list
 */
export const makeToneList = (
  key: PitchName,
  modePref: ScalePref
): PitchName[] => {
  const degreeList = SCALES[modePref]
  const toneList: PitchName[] = []
  const rootIdx = PITCH_NAME.indexOf(key)
  for (const d of degreeList) {
    const idx = (rootIdx + d) % 12
    toneList.push(PITCH_NAME[idx])
  }
  return toneList
}

export const keyDiff = (root: PitchName, compare: PitchName): Semitone => {
  const [ri, ci] = [PITCH_NAME.indexOf(root), PITCH_NAME.indexOf(compare)]
  return (ci - ri + 12) % 12
}

export const pickRandomPitchName = () => {
  return PITCH_NAME[randomIntBetween(0, PITCH_NAME.length)]
}