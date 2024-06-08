import { SequenceNoteMap, makeCreateNotes, mergeNoteMap } from 'mgnr-tone'

const n = makeCreateNotes()

export const kick: SequenceNoteMap = {
  0: n(30),
  2: n(30),
  8: n(30),
}

export const snare: SequenceNoteMap = {
  4: n(42),
  12: n(44),
}

export const fill: SequenceNoteMap = {
  [12 + 48]: n(45),
  [13 + 48]: n(45),
  [14 + 48]: n(45),
  [15 + 48]: n(45),
}

export const kick4: SequenceNoteMap = {
  0: n(30),
  4: n(30),
  8: n(30),
  12: n(30),
}

export const backHH: SequenceNoteMap = {
  2: n(90),
  6: n(90),
  10: n(90),
  14: n(90),
}

export const dnb: SequenceNoteMap = mergeNoteMap(kick, snare)

export const danceBeat: SequenceNoteMap = mergeNoteMap(kick4, backHH)
