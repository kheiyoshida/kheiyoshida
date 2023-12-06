import {
  C1,
  Degree,
  DEGREE_NUM_MAP,
  PitchName,
  PITCH_NAME,
  MidiNum,
  NoteName,
  Semitone,
} from './constants'

/**
 * convert midi number to note name
 */
export const midi2Note = (midiNum: MidiNum): NoteName => {
  const noteName = PITCH_NAME[midiNum % 12]
  const ocatve = Math.floor(midiNum / 12) - 1
  return `${noteName}${ocatve}`
}

/**
 * convert degree to semitone number
 */
export const deg2semi = (degree: Degree|Semitone): Semitone => {
  if (typeof degree === 'number') {
    return degree
  }
  return DEGREE_NUM_MAP[degree]
}

/**
 * convert note name to midi number
 */
export const noteName2Midi = (noteName: NoteName): MidiNum => {
  const { noteIdx, octave } = splitNoteOctave(noteName)
  return C1 + noteIdx + (octave - 1) * 12
}

const splitNoteOctave = (note: string) => {
  if (note.length > 3) {
    throw Error(
      `Note name should be 2-3 characters. 
      Currently not supporting notes higher than C10`
    )
  }

  const noteName = note.slice(0, note.length - 1)
  const idx = PITCH_NAME.indexOf(noteName as PitchName)
  if (idx == -1) {
    throw Error(`Tone name not found`)
  }

  const oct = note.slice(note.length - 1)
  const octave = Number(oct)
  if (Number.isNaN(octave)) {
    throw Error(`Octave couldn't be converted to number`)
  } else if (octave == 0) {
    throw Error(`Octave doesn't support 0`)
  }

  return {
    noteName,
    noteIdx: idx,
    octave,
  }
}
