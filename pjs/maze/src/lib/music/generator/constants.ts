
/**
 * list of all `PitchName`
 */
export const PITCH_NAME = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

/**
 * alphabetically represented pitches(C,D,E…)
 */
export type PitchName = (typeof PITCH_NAME)[number]

/**
 * Pitchname with octave number (C3, C4, C5,...)
 */
export type NoteName = string

/**
 * Semitone for 8th degree(octave)
 */
export const OCTAVE = 12

/**
 * midi number for NoteName C1
 */
export const C1 = 24

/**
 * map for the lowest midi number of each pitch
 */
export const ROOT_TONE = Object.fromEntries(
  PITCH_NAME.map((t, i) => [t, C1 + i])
) as {
  [n in PitchName]: number
}

/**
 * list of all `Degree`
 */
export const DEGREES = [
  '1',
  'b2',
  '2',
  'b3',
  '3',
  '4',
  'b5',
  '5',
  'a5',
  '6',
  'b7',
  '7',
] as const

/**
 * alphabetically represented degrees(1, b1, 2, b3…)
 */
export type Degree = (typeof DEGREES)[number]

/**
 * 12 number of degrees (0,1,2…11)
 */
export type Semitone = number

/**
 * map for `Degree`(string) and `Semitone`(number)
 */
export const DEGREE_NUM_MAP = Object.fromEntries(
  DEGREES.map((d, i) => [d, i])
) as {
  [d in Degree]: Semitone
}

/**
 * preference over specific tones in a scale
 */
export type ScalePref = keyof typeof SCALES

/**
 * list of semitones (degrees) for a specific scale
 */
export type DegreeNumList = readonly Semitone[]

/**
 * map for differnt scales/modes
 */
export const SCALES = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  omit47: [0, 2, 4, 7, 9],
  omit46: [0, 2, 4, 7, 11],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  omit27: [0, 4, 5, 7, 9],
  omit25: [0, 4, 5, 9, 11],
  power: [0, 7],
  _1M: [0, 4, 7],
  _1m: [0, 3, 7],
}  as const

/**
 * midi number for a certain pitch (e.g. 60 for C4)
 */
export type MidiNum = number

export const LOWEST_MIDI_NUM = 24
export const HIGHEST_MIDI_NUM = 120
export const WHOLE_OCTAVES = 8
