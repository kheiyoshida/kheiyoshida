  import { SequenceNoteMap, makeCreateNotes, mergeNoteMap } from '@mgnr/tone'

const n = makeCreateNotes()

export const kick:SequenceNoteMap = {
  0: n(30),
  2: n(30),
  8: n(30)
}

export const snare: SequenceNoteMap = {
  4: n(42),
  12: n(44)
}

export const dnb: SequenceNoteMap = mergeNoteMap(kick, snare)
