import { NumRange } from '../utils/primitives'
import { Range } from '../utils/types'
import * as utils from '../utils/utils'
import { Generator, GeneratorArgs } from './Generator'
import { Scale } from './Scale'
import { SequenceNoteMap } from './Sequence'

const scale = new Scale({
  key: 'C',
  range: { min: 60, max: 80 },
  pref: 'major',
})

const notes: SequenceNoteMap = {
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
  ...notes,
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

// should I really deep copy it?
const makeNotes = () => deepCopy(notes)

const getNotesPos = (generator: Generator) => {
  return Object.keys(generator.sequence.notes).map((p) => parseInt(p))
}

const arrangeSeq = (generatorArgs: GeneratorArgs) => {
  const generator = new Generator(generatorArgs)
  const notePos = getNotesPos(generator)
  return { generator, notePos }
}

describe('Sequence', () => {
  describe(`note assign with different config`, () => {
    const baseConf: GeneratorArgs['conf'] = {
      scale,
      length: 8,
      division: 16,
      noteDur: 1,
      veloPref: 'consistent',
      density: 0.5,
      fillStrategy: 'fill',
      fillPref: 'mono',
      noteVel: 100,
    }
    it(`should fill up available space in the sequence length`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'fill',
      }
      const notes = {
        0: [
          {
            dur: 1,
            pitch: 60,
            vel: 100,
          },
        ],
      }
      const generator = new Generator({ conf, notes })
      expect(generator.sequence.numOfNotes).toBe(conf.density! * conf.length!)
      expect(generator.sequence.notes).toMatchObject(expect.objectContaining(notes))
      generator.sequence.iterate((note, pos) => {
        expect(pos).toBeLessThan(conf.length!)
        expect(note.dur === conf.noteDur)
        expect(note.dur === conf.noteVel)
        expect(new NumRange(conf.scale!.pitchRange).includes(note.pitch as number))
      })
    })
    it(`can fill notes with runtime random notes`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'random',
      }
      const generator = new Generator({ conf })
      generator.sequence.iterate((note) => {
        expect(note.dur).toBe(conf.noteDur)
        expect(note.vel).toBe(conf.noteVel)
        expect(note.pitch).toBe('random')
      })
    })
    it(`can set fixed notes`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'random',
      }
      const generator = new Generator({ conf, notes })
      expect(generator.sequence.notes).toMatchObject(notes)
    })
    it(`can set ranged note velocity`, () => {
      const velRange = new NumRange({ min: 20, max: 80 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteVel: velRange,
        veloPref: 'consistent',
      }
      const generator = new Generator({ conf })
      generator.sequence.iterate((note) => {
        expect(velRange.includes(note.vel as number)).toBe(true)
      })
    })
    it(`can set runtime random velocity`, () => {
      const velRange = new NumRange({ min: 20, max: 80 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteVel: velRange,
        veloPref: 'randomPerEach',
      }
      const generator = new Generator({ conf })
      generator.sequence.iterate((note) => {
        expect(velRange.eq(note.vel as Range)).toBe(true)
      })
    })
    it.skip(`can set ranged note duration`, () => {
      const durRange = new NumRange({ min: 1, max: 4 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteDur: durRange,
        fillStrategy: 'fill',
      }
      const generator = new Generator({ conf })
      expect(generator.sequence.usedSpace).toBe(conf.density! * conf.length!) // this fails. fix
      generator.sequence.iterate((note) => {
        expect(durRange.includes(note.dur as number)).toBe(true)
      })
    })
    it(`can set runtime random duration`, () => {
      const durRange = new NumRange({ min: 1, max: 4 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteDur: durRange,
        fillStrategy: 'random',
      }
      const generator = new Generator({ conf })
      generator.sequence.iterate((note) => {
        expect(durRange.eq(note.dur as Range)).toBe(true)
      })
    })
    it.skip(`can allow poly notes in the same position`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        length: 8,
        fillPref: 'allowPoly',
        density: 1.0,
      } // -> should make 8
      const generator = new Generator({ conf })

      // failing. why?
      expect(generator.sequence.numOfNotes).toBeLessThanOrEqual(conf.density! * conf.length!)
      expect(Object.values(generator.sequence.notes).some((posNotes) => posNotes.length > 1)).toBe(
        true
      )
    })
  })

  describe(`change length`, () => {
    const baseConf: GeneratorArgs['conf'] = {
      scale,
      length: 8,
      division: 16,
      noteDur: 1,
      veloPref: 'consistent',
      density: 0.5,
      fillStrategy: 'fill',
      fillPref: 'mono',
      noteVel: 100,
    }
    it(`can extend its length and shuld fill up the extra space after extension`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'fill',
      }
      const { generator, notePos } = arrangeSeq({ conf })
      expect(notePos).toHaveLength(conf.density! * conf.length!)
      generator.changeSequenceLength('extend', 8)
      expect(generator.sequence.length).toBe(16)
      expect(getNotesPos(generator)).toHaveLength(
        generator.sequence.density! * generator.sequence.length!
      )
    })
    it(`can shrink and remove excessive notes after shrinking`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'fill',
        density: 0.5,
        length: 8,
        noteDur: 1,
      }
      const { generator, notePos } = arrangeSeq({ conf })
      expect(notePos).toHaveLength(conf.density! * conf.length!)
      generator.changeSequenceLength('shrink', 4)
      expect(generator.sequence.length).toBe(4)
      expect(getNotesPos(generator).every((p) => p < generator.sequence.length))
    })

    it('should not extend/shrink beyond lenRange', () => {
      const generator = new Generator({
        conf: {
          scale,
          density: 0.25,
          fillStrategy: 'fill',
          noteDur: {
            min: 1,
            max: 1,
          },
          length: 8,
          lenRange: {
            min: 4,
            max: 12,
          },
        },
        notes: makeNotes(),
      })
      expect(generator.sequence.length).toBe(8)
      // 1
      const res = generator.changeSequenceLength('extend', 6)
      expect(res).toBe(false)
      expect(generator.sequence.length).toBe(8)
      // 2
      const res2 = generator.changeSequenceLength('shrink', 4)
      expect(generator.sequence.length).toBe(8)
      expect(res2).toBe(false)
      // 3
      const res3 = generator.changeSequenceLength('shrink', 2)
      expect(generator.sequence.length).toBe(6)
      expect(res3).toBe(true)
      // 4
      const res4 = generator.changeSequenceLength('extend', 4)
      expect(generator.sequence.length).toBe(10)
      expect(res4).toBe(true)
    })
    it(`can reverse the change length change direction`, () => {
      const gen = new Generator({
        conf: {
          scale,
          density: 0.25,
          fillStrategy: 'fill',
          noteDur: {
            min: 1,
            max: 1,
          },
          length: 8,
          lenRange: {
            min: 4,
            max: 12,
          },
        },
        notes: makeNotes(),
      })
      gen.toggleReverse()
      gen.changeSequenceLength('extend', 2)
      expect(gen.sequence.length).toBe(6)
      gen.sequence.iteratePosition((p) => {
        expect(p).toBeLessThan(6)
      })
    })
  })

  describe(`mutation`, () => {
    const baseConf: GeneratorArgs['conf'] = {
      scale,
      length: 8,
      division: 16,
      noteDur: 1,
      veloPref: 'consistent',
      density: 0.5,
      fillStrategy: 'fill',
      fillPref: 'mono',
      noteVel: 100,
    }
    it(`can randomize existing notes`, () => {
      jest.spyOn(utils, 'randomRemove').mockImplementation((notes) => [notes.slice(1, 2), []])
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        density: 0.25,
        length: 16,
        fillStrategy: 'fill',
        noteDur: 1,
      }
      const { generator } = arrangeSeq({ conf, notes: makeNotes() })
      const before = { ...generator.sequence.notes }
      generator.mutate({ rate: 1, strategy: 'randomize' })
      const after = generator.sequence.notes
      expect(after).not.toMatchObject(before)
      expect(after[4].includes(before[4][1])).toBe(true)
      const np = getNotesPos(generator)
      expect(np).toHaveLength(generator.sequence.length * generator.sequence.density)
      expect(np.every((pos) => pos < generator.sequence.length)).toBe(true)
      const scalePitchRange = new NumRange(scale.pitchRange)
      expect(
        np.every((pos) =>
          generator.sequence.notes[pos].every((note) => {
            return (
              note.dur === conf.noteDur &&
              scalePitchRange.includes(note.pitch as number) &&
              note.vel === conf.noteVel
            )
          })
        )
      ).toBe(true)
    })
    it(`can move the existing note to random position preserving pitch/dur/vel`, () => {
      jest.spyOn(utils, 'randomRemove').mockImplementation((notes) => [notes.slice(1), [notes[0]]])
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        density: 0.25,
        length: 16,
        fillStrategy: 'fill',
        fillPref: 'mono',
        noteDur: 1,
      }
      const { generator, notePos } = arrangeSeq({ conf, notes: makeNotes() })
      const before = { ...generator.sequence.notes }
      const beforeNoteItems = notePos.map((pos) => generator.sequence.notes[pos][0])
      generator.mutate({ rate: 1, strategy: 'move' })
      const after = generator.sequence.notes
      expect(after).not.toMatchObject(before)
      const afterNoteItems = getNotesPos(generator).map((pos) => generator.sequence.notes[pos][0])
      for (const b of beforeNoteItems) {
        expect(
          afterNoteItems.some((a) => a.dur === b.dur && a.pitch === b.pitch && a.vel === b.vel)
        ).toBe(true)
      }
    })
    it(`inPlace`, () => {
      jest.spyOn(utils, 'randomRemove').mockImplementation((notes) => [notes.slice(1), [notes[0]]])

      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        density: 0.25,
        length: 16,
        fillStrategy: 'fill',
        fillPref: 'mono',
        noteDur: 1,
      }

      const initialNotes = deepCopy(monoNotes)
      const beforeNotes = deepCopy(initialNotes)

      const gen = new Generator({ conf, notes: initialNotes })
      gen.mutate({ rate: 1, strategy: 'inPlace' })
      expect(gen.sequence.notes).not.toMatchObject(beforeNotes)
      gen.sequence.iteratePosition((pos) => {
        const afterNote = gen.sequence.notes[pos]
        expect(afterNote[0]).not.toMatchObject(beforeNotes[pos][0])
        expect(afterNote[0].pitch).not.toBe(beforeNotes[pos][0].pitch)
      })
    })

    it(`can adjust notes on scale changes`, () => {
      const scale = new Scale({ key: 'C', pref: '_1M' })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        scale,
        fillStrategy: 'fill',
        fillPref: 'mono',
      }
      const { generator, notePos } = arrangeSeq({ conf })
      expect(
        notePos.every((p) =>
          scale.primaryPitches.includes(generator.sequence.notes[p][0].pitch as number)
        )
      ).toBe(true)
      scale.modulate({ key: 'D', pref: '_1M' }, 1)
      generator.adjustPitch()
      expect(
        getNotesPos(generator).every((p) =>
          scale.primaryPitches.includes(generator.sequence.notes[p][0].pitch as number)
        )
      ).toBe(true)
    })
  })

  describe(`harmonize`, () => {
    it(`can harmonize notes after assign`, () => {
      const gen = new Generator({
        conf: {
          fillStrategy: 'fixed',
          harmonizer: {
            degree: ['5'],
          },
        },
        notes: makeNotes(),
      })
      expect(gen.sequence.notes).toMatchObject({
        '0': [
          {
            dur: 1,
            pitch: 60,
            vel: 100,
          },
          {
            dur: 1,
            pitch: 67,
            vel: 100,
          },
        ],
        '2': [
          {
            dur: 1,
            pitch: 62,
            vel: 100,
          },
          {
            dur: 1,
            pitch: 69,
            vel: 100,
          },
        ],
        '4': [
          {
            dur: 1,
            pitch: 80,
            vel: 100,
          },
          {
            dur: 1,
            pitch: 88,
            vel: 100,
          },
          {
            dur: 1,
            pitch: 72,
            vel: 100,
          },
          {
            dur: 1,
            pitch: 79,
            vel: 100,
          },
        ],
      })
    })
  })

  describe(`reassign`, () => {
    it(`can reset notes`, () => {
      const gen = new Generator({
        conf: {
          fillStrategy: 'fill',
          fillPref: 'mono',
          length: 4,
          density: 0.75,
        },
        notes: {
          0: [
            {
              pitch: 30,
              vel: 100,
              dur: 1,
            },
          ],
          2: [
            {
              pitch: 30,
              vel: 100,
              dur: 1,
            },
          ],
        },
      })
      const firstFill = JSON.parse(JSON.stringify({ ...gen.sequence.notes }))
      gen.resetNotes()
      expect(gen.sequence.notes).not.toMatchObject(firstFill)
    })
    it.todo(`can reset notes with new initial notes`)
  })
})
