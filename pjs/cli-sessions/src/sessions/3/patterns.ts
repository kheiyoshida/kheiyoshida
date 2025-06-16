import { SequenceNoteMap } from '@mgnr/cli'
import { hh1, kick1, snare1 } from './config.js'

const note = (pitch: number) => ({
  pitch,
  vel: 100,
  dur: 1,
})

export const beat1: SequenceNoteMap = {
  0: [note(kick1)],
  12: [note(snare1)],
}

export const beat2: SequenceNoteMap = {
  0: [note(kick1)],
  4: [note(snare1)],
  10: [note(kick1)],
}

export const beat3: SequenceNoteMap = {
  0: [note(kick1)],
  4: [note(snare1)],
  10: [note(snare1)],
  12: [note(snare1)],
}

export const beat4: SequenceNoteMap = {
  0: [note(kick1)],
  14: [note(hh1)],
  15: [note(hh1)],
}
