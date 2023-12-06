import { Sequence } from './Sequence'
import { Note } from './Note'

const notes = {
  0: [
    {
      dur: 1,
      pitch: 60,
      vel: 100,
    },
  ],
  2: [
    {
      dur: 1,
      pitch: 62,
      vel: 100,
    },
  ],
  4: [
    {
      dur: 1,
      pitch: 80,
      vel: 100,
    },
    {
      dur: 1,
      pitch: 72,
      vel: 100,
    },
  ],
}

const makeNotes = () => JSON.parse(JSON.stringify(notes))

describe(`SequenceNotes`, () => {
  it(`can assign note`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    const note: Note = {
      dur: 1,
      pitch: 80,
      vel: 100,
    }
    seqNotes.assignNote(0, note)
    expect(seqNotes.notes[0][1]).toMatchObject(note)
    seqNotes.assignNote(3, note)
    expect(seqNotes.notes[3][0]).toMatchObject(note)
  })
  it(`can delete notes`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.deletePosition(0)
    seqNotes.deletePosition(4)
    expect(seqNotes.notes).toMatchObject({ 2: notes[2] })
  })
  it('getAvailablePosition', () => {
    const currentNotes = makeNotes()
    const alreadyUsed = Object.keys(currentNotes).map((k) => Number(k))
    const seqNotes = new Sequence({ fillPref: 'mono' })
    seqNotes.replaceEntireNotes(currentNotes)
    for (let i = 0; i < 50; i++) {
      const res = seqNotes.getAvailablePosition()
      expect(typeof res).toBe('number')
      expect(alreadyUsed.includes(res as number)).not.toBe(true)
    }
  })
  it(`can iterate over available positions`, () => {
    // 1
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.iteratePos((pos) => seqNotes.deletePosition(pos))
    expect(seqNotes.notes).toMatchInlineSnapshot(`{}`)
    // 2
    const seqNotes2 = new Sequence()
    seqNotes2.replaceEntireNotes(makeNotes())
    expect(seqNotes2.notes[0]).toHaveLength(1)
    seqNotes2.iteratePos((pos) =>
      seqNotes2.notes[pos].forEach((n) => (n.pitch = 72))
    )
    expect(
      seqNotes2.iteratePos((p) =>
        seqNotes2.notes[p].forEach((n) => n.pitch === 72)
      )
    )
  })
  it(`can iterate on each note`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.iterate((n) => (n.pitch = 72))
    expect(
      seqNotes.iteratePos((p) =>
        seqNotes.notes[p].forEach((n) => n.pitch === 72)
      )
    )
  })
  it(`can clear notes`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.clearNotes()
    expect(seqNotes.numOfNotes).toBe(0)
  })
})
