import { BufferedNote, NoteBuffer, findIndexBackwards } from './Buffer'

describe(`${NoteBuffer.name}`, () => {
  it(`should always have sorted items`, () => {
    const note1 = {
      time: 2,
      pitch: 60,
    } as BufferedNote
    const note2 = {
      time: 1,
      pitch: 62,
    } as BufferedNote
    const note3 = {
      time: 3,
      pitch: 67,
    } as BufferedNote
    const buffer = new NoteBuffer(4)
    buffer.insert(note1)
    buffer.insert(note2)
    buffer.insert(note3)
    expect(buffer.consume(0)).toEqual([note2, note1, note3])
    expect(buffer.consume(0)).toEqual([])
  })
  it(`returns only notes in time frame`, () => {
    const note1 = {
      time: 2,
      pitch: 60,
    } as BufferedNote
    const note2 = {
      time: 1,
      pitch: 62,
    } as BufferedNote
    const note3 = {
      time: 5,
      pitch: 67,
    } as BufferedNote
    const buffer = new NoteBuffer(4)
    buffer.insert(note1)
    buffer.insert(note2)
    buffer.insert(note3)
    expect(buffer.consume(0)).toEqual([note2, note1])
    expect(buffer.consume(4)).toEqual([note3])
  })
  it(`should not insert notes with the same time`, () => {
    const note1 = {
      time: 2,
      pitch: 60,
    } as BufferedNote
    const note2 = {
      time: 2,
      pitch: 62,
    } as BufferedNote
    const buffer = new NoteBuffer(4)
    buffer.insert(note1)
    buffer.insert(note2)
    expect(buffer.consume(0)).toEqual([note1])
  })
})

test(`${findIndexBackwards.name}`, () => {
  const notes = [
    {
      time: 1
    },
    {
      time: 3,
    },
    {
      time: 4
    }
  ] as BufferedNote[]
  expect(findIndexBackwards(notes, {time: 5} as BufferedNote)).toBe(3)
  expect(findIndexBackwards(notes, {time: 2} as BufferedNote)).toBe(1)
  expect(findIndexBackwards(notes, {time: 1} as BufferedNote)).toBe(null)
  expect(findIndexBackwards(notes, {time: 0} as BufferedNote)).toBe(0)
})