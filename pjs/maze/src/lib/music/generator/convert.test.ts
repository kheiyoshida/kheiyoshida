import { C1 } from "./constants";
import { noteName2Midi, midi2Note } from "./convert";

describe(`convertToneNum`, () => {
  it(`should convert midi number to NOTE OCTAVE format`, () => {
    expect(midi2Note(C1)).toBe('C1')
    expect(midi2Note(60)).toBe('C4')
    expect(midi2Note(63)).toBe('D#4')
  })
})

describe(`convert2Num`, () => {
  it(`should convert note to midi number`, () => {
    expect(noteName2Midi('C4')).toBe(60)
    expect(noteName2Midi('D#4')).toBe(63)
  })
  it(`should reject unsupported notes`, () => {
    expect(() => noteName2Midi('C10')).toThrowError()
    expect(() => noteName2Midi('C0')).toThrowError()
    expect(() => noteName2Midi('D#10')).toThrowError()
  })
})