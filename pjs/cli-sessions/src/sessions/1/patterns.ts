import { SequenceNoteMap } from '@mgnr/cli'

const kick = 60
const snare = 62
const hh = 66
const dn = (p: number) => ({
  pitch: p,
  vel: 100,
  dur: 1
})

export const beat: SequenceNoteMap = {
  0: [
    dn(kick)
  ],
  8: [
    dn(snare)
  ],
}
