import { SequenceNoteMap } from '@mgnr/cli'
import { hh1, kick, snare } from './config.js'

const note = (pitch: number) => ({
  pitch,
  vel: 100,
  dur: 1,
})

export const beat1: SequenceNoteMap = {
  0: [note(kick)],
  12: [note(snare)],
}

export const beat2: SequenceNoteMap = {
  0: [note(kick)],
  4: [note(snare)],
  10: [note(kick)],
}

export const beat3: SequenceNoteMap = {
  0: [note(kick)],
  4: [note(snare)],
  10: [note(snare)],
  12: [note(snare)],
}

export const beat4: SequenceNoteMap = {
  0: [note(kick)],
  14: [note(hh1)],
  15: [note(hh1)],
}
