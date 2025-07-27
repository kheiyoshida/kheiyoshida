import { SequenceNoteMap } from '@mgnr/cli'
import { hh1, hh2, kick1, snare1 } from './config.js'
import { kick } from '../2/config.js'

const note = (pitch: number) => ({
  pitch,
  vel: 100,
  dur: 1,
})

export const beat1: SequenceNoteMap = {
  0: [note(kick1)],
  2: [note(kick1)],
}

export const beat2: SequenceNoteMap = {
  0: [note(kick1)],
  2: [note(kick)],
  8: [note(snare1)],
}

export const beat3: SequenceNoteMap = {
  0: [note(kick1)],
  7: [note(snare1)],
  8: [note(snare1)],
}

export const beat4: SequenceNoteMap = {
  0: [note(kick1)],
  8: [note(kick1)],
  14: [note(hh1)],
  15: [note(hh2)],
}
