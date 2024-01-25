import * as utils from 'utils'
import { MockOutlet } from '../Outlet.test'
import { SequenceGenerator } from './Generator'
import { NotePicker } from './NotePicker'
import { Sequence, SequenceNoteMap } from './Sequence'
import { Scale } from './scale/Scale'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils')
}))

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

describe(`${SequenceGenerator.name}`, () => {
  describe(`${SequenceGenerator.prototype.feedOutlet.name}`, () => {
    it(`can set an outlet to feed sequence to`, () => {
      const generator = new SequenceGenerator(new NotePicker({}), new Sequence())
      const outlet = new MockOutlet('fakeInst')
      generator.feedOutlet(outlet)
      expect(outlet.generator).toBe(generator)
    })
    it(`should not override the outlet`, () => {
      const generator = new SequenceGenerator(new NotePicker({}), new Sequence())
      const outlet = new MockOutlet('fakeInst')
      generator.feedOutlet(outlet)
      expect(outlet.generator).toBe(generator)
      const outlet2 = new MockOutlet('anotherInst')
      expect(() => generator.feedOutlet(outlet2)).toThrow()
      expect(() => outlet2.generator).toThrow()
    })
  })
  describe(`${SequenceGenerator.prototype.updateConfig.name}`, () => {
    const make = () => {
      const picker = new NotePicker({ noteDur: { min: 1, max: 4 } })
      const scale = new Scale()
      const sequence = new Sequence({ density: 0.5, length: 8 })
      const generator = new SequenceGenerator(picker, sequence)
      return { picker, scale, sequence, generator }
    }
    it(`should update config with given fields & values`, () => {
      const { generator, sequence, picker } = make()
      generator.updateConfig({
        density: 0.9,
      })
      expect(sequence.density).toBe(0.9)
      generator.updateConfig({
        noteDur: 2,
      })
      expect(picker.conf.noteDur).toBe(2)
    })
  })
  describe(`${SequenceGenerator.prototype.constructNotes.name}`, () => {
    it(`should assign initial notes if provided`, () => {
      const generator = new SequenceGenerator(
        new NotePicker({ fillStrategy: 'fixed' }),
        new Sequence()
      )
      generator.constructNotes(defaultNotes)
      expect(generator.sequence.notes).toMatchObject(defaultNotes)
    })
    it(`should harmonize initial notes when harmonizer enabled`, () => {
      const picker = new NotePicker({ fillStrategy: 'fixed', harmonizer: { degree: ['5'] } }, scale)
      const sequence = new Sequence()
      const generator = new SequenceGenerator(picker, sequence)
      generator.constructNotes(monoNotes)
      sequence.iterateNotesAtPosition((notesAtPos) => {
        expect(notesAtPos[1]).toMatchObject(picker.harmonizeNote(notesAtPos[0])[0])
      })
    })
    it(`should fill up available space after assigning initial notes`, () => {
      const picker = new NotePicker({ fillStrategy: 'fill', noteDur: 1 })
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new SequenceGenerator(picker, sequence)
      const initialNotes = { 0: defaultNotes[0].slice() }
      generator.constructNotes(initialNotes)
      expect(generator.sequence.numOfNotes).toBe(sequence.density * sequence.length) // 4 notes
      expect(generator.sequence.notes).toMatchObject(expect.objectContaining(initialNotes))
    })
  })

  describe(`${SequenceGenerator.prototype.changeSequenceLength.name}`, () => {
    it(`can extend its sequence length, filling the extended part with notes`, () => {
      const picker = new NotePicker({ fillStrategy: 'fill', noteDur: 1 })
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new SequenceGenerator(picker, sequence)
      generator.changeSequenceLength('extend', 8)
      expect(sequence.length).toBe(16)
      expect(sequence.numOfNotes).toBe(sequence.density * sequence.length)
    })
    it(`can shrink and remove excessive notes after shrinking`, () => {
      const picker = new NotePicker({ fillStrategy: 'fill', noteDur: 1 })
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new SequenceGenerator(picker, sequence)
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
      const generator = new SequenceGenerator(picker, sequence)
      expect(generator.sequence.length).toBe(8)
      // 8 -> 14 x
      generator.changeSequenceLength('extend', 6)
      expect(sequence.length).toBe(8)
      // 8 -> 4 x
      generator.changeSequenceLength('shrink', 4)
      expect(sequence.length).toBe(8)
      // 8 -> 6 o
      generator.changeSequenceLength('shrink', 2)
      expect(sequence.length).toBe(6)
      // 6 -> 10 o
      generator.changeSequenceLength('extend', 4)
      expect(sequence.length).toBe(10)
    })
  })

  describe(`${SequenceGenerator.prototype.mutate.name}`, () => {
    beforeEach(() => {
      jest
        .spyOn(utils, 'randomRemoveFromArray')
        .mockImplementation((notes) => [notes.slice(1, 2), [notes[0]]]) // all removed except the second note
    })
    it(`can randomize existing notes`, () => {
      const picker = new NotePicker({})
      const sequence = new Sequence({ length: 8, density: 0.5 })
      const generator = new SequenceGenerator(picker, sequence)
      generator.constructNotes(defaultNotes)
      const before = { ...sequence.notes }
      generator.mutate({ rate: 1, strategy: 'randomize' })
      const after = sequence.notes
      expect(after).not.toMatchObject(before)
      expect(after[4].includes(before[4][1])).toBe(true) // survived note
    })
    it(`can move the existing notes to random position preserving pitch/dur/vel`, () => {
      const picker = new NotePicker({ fillStrategy: 'fixed' })
      const sequence = new Sequence()
      const generator = new SequenceGenerator(picker, sequence)
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
      const generator = new SequenceGenerator(picker, sequence)
      generator.constructNotes(defaultNotes)
      const beforeNotes = deepCopy({ ...sequence.notes })
      generator.mutate({ rate: 1, strategy: 'inPlace' })
      expect(sequence.notes).not.toMatchObject(beforeNotes)
      sequence.iterateNotesAtPosition((afterNotes, pos) => {
        expect(afterNotes[0]).not.toMatchObject(beforeNotes[pos][0])
        expect(afterNotes[0].pitch).not.toBe(beforeNotes[pos][0].pitch)
      })
    })
  })

  describe(`${SequenceGenerator.prototype.adjustPitch.name}`, () => {
    it(`can adjust notes on scale changes`, () => {
      const scale = new Scale({ key: 'C', pref: '_1M' })
      const picker = new NotePicker({ fillStrategy: 'fill' }, scale)
      const sequence = new Sequence({ fillPref: 'mono', length: 8, density: 0.5 })
      const generator = new SequenceGenerator(picker, sequence)
      generator.constructNotes()
      sequence.iterateEachNote((note) => {
        expect(scale.primaryPitches.includes(note.pitch as number)).toBe(true)
      })
      scale.modulate({ key: 'D', pref: '_1M' }, 1)
      generator.adjustPitch()
      sequence.iterateEachNote((note) => {
        expect(scale.primaryPitches.includes(note.pitch as number)).toBe(true)
      })
    })
  })

  describe(`${SequenceGenerator.prototype.eraseSequenceNotes.name}`, () => {
    const sequence = new Sequence({ fillPref: 'mono' })
    const generator = new SequenceGenerator(new NotePicker({}), sequence)
    generator.constructNotes()
    expect(sequence.numOfNotes).toBe(8)
    generator.eraseSequenceNotes()
    expect(sequence.numOfNotes).toBe(0)
  })

  describe(`${SequenceGenerator.prototype.resetNotes.name}`, () => {
    it(`can reset notes`, () => {
      const picker = new NotePicker({})
      const sequence = new Sequence()
      const generator = new SequenceGenerator(picker, sequence)
      generator.constructNotes()
      const firstFill = generator.notes
      generator.resetNotes()
      const secondFill = generator.notes
      expect(secondFill).not.toMatchObject(firstFill)
    })
  })
})
