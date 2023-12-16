import { Sequence } from './Sequence'
import { Note } from './Note'
import * as utils from '../utils/utils'

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

describe(`${Sequence.name}`, () => {
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
    seqNotes.deleteNotesInPosition(0)
    seqNotes.deleteNotesInPosition(4)
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
    seqNotes.iteratePosition((pos) => seqNotes.deleteNotesInPosition(pos))
    expect(seqNotes.notes).toMatchInlineSnapshot(`{}`)
    // 2
    const seqNotes2 = new Sequence()
    seqNotes2.replaceEntireNotes(makeNotes())
    expect(seqNotes2.notes[0]).toHaveLength(1)
    seqNotes2.iteratePosition((pos) => seqNotes2.notes[pos].forEach((n) => (n.pitch = 72)))
    expect(seqNotes2.iteratePosition((p) => seqNotes2.notes[p].forEach((n) => n.pitch === 72)))
  })
  it(`can iterate on each note`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.iterate((n) => (n.pitch = 72))
    expect(seqNotes.iteratePosition((p) => seqNotes.notes[p].forEach((n) => n.pitch === 72)))
  })
  it(`can clear notes`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.deleteEntireNotes()
    expect(seqNotes.numOfNotes).toBe(0)
  })
  it(`can delete notes randomly`, () => {
    jest.spyOn(utils, 'randomRemove').mockImplementation((notes) => {
      if (notes.length > 1)
        return [
          [notes[0]], // survive
          notes.slice(1), // removed
        ]
      else return [[], notes] // all removed
    })
    const sequence = new Sequence()
    sequence.replaceEntireNotes(makeNotes())
    const before = { ...sequence.notes }
    const removed = sequence.deleteRandomNotes(1) // 1 does nothing
    const after = sequence.notes
    expect(after).not.toMatchObject(before)
    expect(after).toMatchObject({
      '4': [
        {
          dur: 1,
          pitch: 80,
          vel: 100,
        },
      ],
    })
    expect(removed).toMatchObject([
      {
        dur: 1,
        pitch: 60,
        vel: 100,
      },
      {
        dur: 1,
        pitch: 62,
        vel: 100,
      },
      {
        dur: 1,
        pitch: 72,
        vel: 100,
      },
    ])
  })
})
