import * as utils from '../../utils/utils'
import { Generator } from './Generator'
import { NotePicker } from './NotePicker'
import { Scale } from './Scale'
import { Sequence, SequenceNoteMap } from './Sequence'

const scale = new Scale({
  key: 'C',
  range: { min: 60, max: 80 },
  pref: 'major',
})

const defaultNotes: SequenceNoteMap = {
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

const monoNotes: SequenceNoteMap = {
  ...defaultNotes,
  3: [
    {
      dur: 1,
      pitch: 72,
      vel: 100,
    },
  ],
  4: [
    {
      dur: 1,
      pitch: 80,
      vel: 100,
    },
  ],
}

const deepCopy = <T>(v: T) => JSON.parse(JSON.stringify(v)) as T

describe(`${Generator.name}`, () => {
  describe(`${Generator.prototype.constructNotes.name}`, () => {
    it(`should assign initial notes if provided`, () => {
      const generator = new Generator(new NotePicker({ fillStrategy: 'fixed' }), new Sequence())
      generator.constructNotes(defaultNotes)
      expect(generator.sequence.notes).toMatchObject(defaultNotes)
    })
    it(`should harmonize initial notes when harmonizer enabled`, () => {
      const picker = new NotePicker({ fillStrategy: 'fixed', harmonizer: { degree: ['5'] } }, scale)
      const sequence = new Sequence()
      const generator = new Generator(picker, sequence)
      generator.constructNotes(monoNotes)
      sequence.iterateNotesAtPosition((notesAtPos) => {
        expect(notesAtPos[1]).toMatchObject(picker.harmonizeNote(notesAtPos[0])[0])
      })
    })
    it(`should fill up available space after assigning initial notes`, () => {
      const picker = new NotePicker({ fillStrategy: 'fill', noteDur: 1 })
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new Generator(picker, sequence)
      const initialNotes = { 0: defaultNotes[0].slice() }
      generator.constructNotes(initialNotes)
      expect(generator.sequence.numOfNotes).toBe(sequence.conf.density * sequence.conf.length) // 4 notes
      expect(generator.sequence.notes).toMatchObject(expect.objectContaining(initialNotes))
    })
  })

  describe(`${Generator.prototype.changeSequenceLength.name}`, () => {
    it(`can extend its length and shuld fill up the extra space after extension`, () => {
      const picker = new NotePicker({ fillStrategy: 'fill', noteDur: 1 })
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new Generator(picker, sequence)
      generator.changeSequenceLength('extend', 8)
      expect(sequence.length).toBe(16)
      expect(sequence.numOfNotes).toBe(sequence.density * sequence.length)
    })
    it(`can shrink and remove excessive notes after shrinking`, () => {
      const picker = new NotePicker({ fillStrategy: 'fill', noteDur: 1 })
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new Generator(picker, sequence)
      generator.changeSequenceLength('shrink', 4)
      expect(generator.sequence.length).toBe(4)
      sequence.iterateEachNote((_, position) => {
        expect(position).toBeLessThan(sequence.length)
      })
    })
    it('should not extend/shrink beyond lenRange', () => {
      const lenRange = { min: 4, max: 12 }
      const picker = new NotePicker({})
      const sequence = new Sequence({ length: 8, lenRange })
      const generator = new Generator(picker, sequence)
      expect(generator.sequence.length).toBe(8)
      // 1
      const res = generator.changeSequenceLength('extend', 6)
      expect(res).toBe(false)
      expect(sequence.length).toBe(8)
      // 2
      const res2 = generator.changeSequenceLength('shrink', 4)
      expect(sequence.length).toBe(8)
      expect(res2).toBe(false)
      // 3
      const res3 = generator.changeSequenceLength('shrink', 2)
      expect(sequence.length).toBe(6)
      expect(res3).toBe(true)
      // 4
      const res4 = generator.changeSequenceLength('extend', 4)
      expect(sequence.length).toBe(10)
      expect(res4).toBe(true)
    })
    it(`can reverse the length change direction`, () => {
      const lenRange = { min: 4, max: 12 }
      const picker = new NotePicker({})
      const sequence = new Sequence({ length: 8, lenRange })
      const generator = new Generator(picker, sequence)
      generator.toggleReverse()
      generator.changeSequenceLength('extend', 2)
      expect(sequence.length).toBe(6)
      sequence.iteratePosition((p) => {
        expect(p).toBeLessThan(6)
      })
    })
  })

  describe(`${Generator.prototype.mutate.name}`, () => {
    beforeEach(() => {
      jest
        .spyOn(utils, 'randomRemove')
        .mockImplementation((notes) => [notes.slice(1, 2), [notes[0]]]) // all removed except the second note
    })
    it(`can randomize existing notes`, () => {
      const picker = new NotePicker({})
      const sequence = new Sequence({ length: 8, density: 0.5 })
      const generator = new Generator(picker, sequence)
      generator.constructNotes(defaultNotes)
      const before = { ...sequence.notes }
      generator.mutate({ rate: 1, strategy: 'randomize' })
      const after = sequence.notes
      expect(after).not.toMatchObject(before)
      expect(after[4].includes(before[4][1])).toBe(true) // survived note
    })
    it(`can move the existing notes to random position preserving pitch/dur/vel`, () => {
      const picker = new NotePicker({ fillStrategy: 'fixed'})
      const sequence = new Sequence()
      const generator = new Generator(picker, sequence)
      generator.constructNotes(monoNotes)
      const before = deepCopy({ ...generator.notes })
      generator.mutate({ rate: 1, strategy: 'move' })
      const after = generator.notes
      expect(after).not.toMatchObject(before)
      expect(() =>
        // should find moved note somewhere
        sequence.iterateEachNote((note) => {
          let found = false
          Sequence.iterateEachNote(before, (beforeNote) => {
            if (
              note.pitch === beforeNote.pitch &&
              note.dur === beforeNote.dur &&
              note.vel === beforeNote.vel
            ) {
              found = true
            }
          })
          if (!found) {
            throw Error()
          }
        })
      ).not.toThrow()
    })
    it(`can randomly alter note's pitch in place`, () => {
      const picker = new NotePicker({})
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new Generator(picker, sequence)
      generator.constructNotes(defaultNotes)
      const beforeNotes = deepCopy({...sequence.notes})
      generator.mutate({ rate: 1, strategy: 'inPlace' })
      expect(sequence.notes).not.toMatchObject(beforeNotes)
      sequence.iterateNotesAtPosition((afterNotes, pos) => {
        expect(afterNotes[0]).not.toMatchObject(beforeNotes[pos][0])
        expect(afterNotes[0].pitch).not.toBe(beforeNotes[pos][0].pitch)
      })
    })
  })

  describe(`${Generator.prototype.adjustPitch.name}`, () => {
    it(`can adjust notes on scale changes`, () => {
      const scale = new Scale({ key: 'C', pref: '_1M' })
      const picker = new NotePicker({ fillStrategy: 'fill'}, scale)
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new Generator(picker, sequence)
      generator.constructNotes()
      sequence.iterateEachNote((note) => {
        expect(
          scale.primaryPitches.includes(note.pitch as number)
        ).toBe(true)
      })
      scale.modulate({ key: 'D', pref: '_1M' }, 1)
      generator.adjustPitch()
      sequence.iterateEachNote((note) => {
        expect(
          scale.primaryPitches.includes(note.pitch as number)
        ).toBe(true)
      })
    })
  })

  describe(`${Generator.prototype.eraseSequenceNotes.name}`, () => {
    const sequence = new Sequence({fillPref: 'mono'})
    const generator = new Generator(new NotePicker({}),sequence)
    generator.constructNotes()
    expect(sequence.numOfNotes).toBe(8)
    generator.eraseSequenceNotes()
    expect(sequence.numOfNotes).toBe(0)
  })

  describe(`${Generator.prototype.resetNotes.name}`, () => {
    it(`can reset notes`, () => {
      const picker = new NotePicker({})
      const sequence = new Sequence()
      const generator = new Generator(picker,sequence)
      generator.constructNotes()
      const firstFill = generator.notes
      generator.resetNotes()
      const secondFill = generator.notes
      expect(secondFill).not.toMatchObject(firstFill)
    })
  })
})
