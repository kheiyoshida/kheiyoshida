  import { SequenceNoteMap, makeCreateNotes, mergeNoteMap } from 'mgnr-tone'

const n = makeCreateNotes()

export const kick:SequenceNoteMap = {
  0: n(30),
  2: n(30),
  8: n(30),
}

export const snare: SequenceNoteMap = {
  4: n(42),
  12: n(44)
}

export const fill: SequenceNoteMap = {
  [12 + 48]: n(45),
  [13 + 48]: n(45),
  [14 + 48]: n(45),
  [15 + 48]: n(45)
}

export const dnb: SequenceNoteMap = mergeNoteMap(kick, snare,)
