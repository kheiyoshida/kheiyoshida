import { NumRange } from '../utils/primitives'
import { Range } from '../utils/types'
import * as utils from '../utils/utils'
import { Generator, GeneratorArgs } from './Generator'
import { Scale } from './Scale'
import { SeqNotes } from './Sequence'

const scale = new Scale({
  key: 'C',
  range: { min: 60, max: 80 },
  pref: 'major',
})
const notes: SeqNotes = {
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

const monoNotes: SeqNotes = {
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

const makeNotes = () => deepCopy(notes)

const getNotesPos = (seq: Generator) => {
  return Object.keys(seq.sequence.notes).map((p) => parseInt(p))
}

const arrangeSeq = (c: GeneratorArgs) => {
  const seq = new Generator(c)
  const notePos = getNotesPos(seq)
  return { seq, notePos }
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
      const { seq, notePos } = arrangeSeq({ conf, notes })
      expect(seq.sequence.numOfNotes).toBe(conf.density! * conf.length!)
      expect(seq.sequence.notes).toMatchObject(expect.objectContaining(notes))
      seq.sequence.iteratePos((pos) => expect(pos < conf.length!).toBe(true))
      const pitchRange = new NumRange(conf.scale!.range)
      expect(
        notePos.every((pos) =>
          seq.sequence.notes[pos].every((n) => {
            return (
              n.dur === conf.noteDur &&
              n.vel === conf.noteVel &&
              pitchRange.includes(n.pitch as number)
            )
          })
        )
      ).toBe(true)
    })
    it(`can fill notes with runtime random notes`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'random',
      }
      const { seq, notePos } = arrangeSeq({ conf })
      expect(
        notePos.every((pos) =>
          seq.sequence.notes[pos].every((n) => {
            return (
              n.dur === conf.noteDur &&
              n.vel === conf.noteVel &&
              n.pitch === 'random'
            )
          })
        )
      ).toBe(true)
    })
    it(`can set fixed notes`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        fillStrategy: 'random',
      }
      const { seq } = arrangeSeq({ conf, notes })
      expect(seq.sequence.notes).toMatchObject(notes)
    })
    it(`can set ranged note velocity`, () => {
      const velRange = new NumRange({ min: 20, max: 80 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteVel: velRange,
        veloPref: 'consistent',
      }
      const { seq, notePos } = arrangeSeq({ conf })
      expect(
        notePos.every((pos) =>
          seq.sequence.notes[pos].every((n) =>
            velRange.includes(n.vel as number)
          )
        )
      ).toBe(true)
    })
    it(`can set runtime random velocity`, () => {
      const velRange = new NumRange({ min: 20, max: 80 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteVel: velRange,
        veloPref: 'randomPerEach',
      }
      const { seq, notePos } = arrangeSeq({ conf })
      expect(
        notePos.every((pos) =>
          seq.sequence.notes[pos].every((n) => velRange.eq(n.vel as Range))
        )
      ).toBe(true)
    })
    it(`can set ranged note duration`, () => {
      const durRange = new NumRange({ min: 1, max: 4 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteDur: durRange,
        fillStrategy: 'fill',
      }
      for (let i = 0; i < 10; i++) {
        const { seq, notePos } = arrangeSeq({ conf })
        expect(notePos.length).toBeLessThanOrEqual(conf.density! * conf.length!)
        expect(
          notePos.every((pos) =>
            seq.sequence.notes[pos].every((n) =>
              durRange.includes(n.dur as number)
            )
          )
        ).toBe(true)
      }
    })
    it(`can set runtime random duration`, () => {
      const durRange = new NumRange({ min: 1, max: 4 })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        noteDur: durRange,
        fillStrategy: 'random',
      }
      const { seq, notePos } = arrangeSeq({ conf })
      expect(notePos.length).toBeLessThanOrEqual(conf.density! * conf.length!)
      expect(
        notePos.every((pos) =>
          seq.sequence.notes[pos].every((n) => durRange.eq(n.dur as Range))
        )
      ).toBe(true)
    })
    it(`can allow poly notes in the same position`, () => {
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        length: 8,
        fillPref: 'allowPoly',
        density: 1.0,
      }
      const { seq, notePos } = arrangeSeq({ conf })
      expect(notePos.length).toBeLessThanOrEqual(conf.density! * conf.length!)
      expect(notePos.some((pos) => seq.sequence.notes[pos].length > 1)).toBe(
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
      const { seq, notePos } = arrangeSeq({ conf })
      expect(notePos).toHaveLength(conf.density! * conf.length!)
      seq.changeSequenceLength('extend', 8)
      expect(seq.sequence.length).toBe(16)
      expect(getNotesPos(seq)).toHaveLength(
        seq.sequence.density! * seq.sequence.length!
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
      const { seq, notePos } = arrangeSeq({ conf })
      expect(notePos).toHaveLength(conf.density! * conf.length!)
      seq.changeSequenceLength('shrink', 4)
      expect(seq.sequence.length).toBe(4)
      expect(getNotesPos(seq).every((p) => p < seq.sequence.length))
    })

    it('should not extend/shrink beyond lenRange', () => {
      const seq = new Generator({
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
      expect(seq.sequence.length).toBe(8)
      // 1
      const res = seq.changeSequenceLength('extend', 6)
      expect(res).toBe(false)
      expect(seq.sequence.length).toBe(8)
      // 2
      const res2 = seq.changeSequenceLength('shrink', 4)
      expect(seq.sequence.length).toBe(8)
      expect(res2).toBe(false)
      // 3
      const res3 = seq.changeSequenceLength('shrink', 2)
      expect(seq.sequence.length).toBe(6)
      expect(res3).toBe(true)
      // 4
      const res4 = seq.changeSequenceLength('extend', 4)
      expect(seq.sequence.length).toBe(10)
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
      gen.sequence.iteratePos((p) => {
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
    it(`can remove notes`, () => {
      jest.spyOn(utils, 'randomRemove').mockImplementation((notes) => {
        if (notes.length > 1) {
          return [
            [notes[0]], // survive
            notes.slice(1),
          ]
        } else {
          return [[], notes]
        }
      })
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        density: 0.25,
        fillStrategy: 'fixed',
      }
      const { seq, notePos } = arrangeSeq({ conf, notes: makeNotes() })
      expect(notePos).toHaveLength(3)
      const before = { ...seq.sequence.notes }
      const removed = seq.randomRemove()
      const after = seq.sequence.notes
      expect(after).not.toMatchObject(before)
      expect(after).toMatchInlineSnapshot(`
        {
          "4": [
            {
              "dur": 1,
              "pitch": 80,
              "vel": 100,
            },
          ],
        }
      `)
      expect(removed).toMatchInlineSnapshot(`
        [
          {
            "dur": 1,
            "pitch": 60,
            "vel": 100,
          },
          {
            "dur": 1,
            "pitch": 62,
            "vel": 100,
          },
          {
            "dur": 1,
            "pitch": 72,
            "vel": 100,
          },
        ]
      `)
    })
    it(`can randomize existing notes`, () => {
      jest
        .spyOn(utils, 'randomRemove')
        .mockImplementation((notes) => [notes.slice(1, 2), []])
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        density: 0.25,
        length: 16,
        fillStrategy: 'fill',
        noteDur: 1,
      }
      const { seq } = arrangeSeq({ conf, notes: makeNotes() })
      const before = { ...seq.sequence.notes }
      seq.mutate({ rate: 1, strategy: 'randomize' })
      const after = seq.sequence.notes
      expect(after).not.toMatchObject(before)
      expect(after[4].includes(before[4][1])).toBe(true)
      const np = getNotesPos(seq)
      expect(np).toHaveLength(seq.sequence.length * seq.sequence.density)
      expect(np.every((pos) => pos < seq.sequence.length)).toBe(true)
      const scalePitchRange = new NumRange(scale.range)
      expect(
        np.every((pos) =>
          seq.sequence.notes[pos].every((note) => {
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
      jest
        .spyOn(utils, 'randomRemove')
        .mockImplementation((notes) => [notes.slice(1), [notes[0]]])
      const conf: GeneratorArgs['conf'] = {
        ...baseConf,
        density: 0.25,
        length: 16,
        fillStrategy: 'fill',
        fillPref: 'mono',
        noteDur: 1,
      }
      const { seq, notePos } = arrangeSeq({ conf, notes: makeNotes() })
      const before = { ...seq.sequence.notes }
      const beforeNoteItems = notePos.map((pos) => seq.sequence.notes[pos][0])
      seq.mutate({ rate: 1, strategy: 'move' })
      const after = seq.sequence.notes
      expect(after).not.toMatchObject(before)
      const afterNoteItems = getNotesPos(seq).map(
        (pos) => seq.sequence.notes[pos][0]
      )
      for (const b of beforeNoteItems) {
        expect(
          afterNoteItems.some(
            (a) => a.dur === b.dur && a.pitch === b.pitch && a.vel === b.vel
          )
        ).toBe(true)
      }
    })
    it(`inPlace`, () => {
      jest
        .spyOn(utils, 'randomRemove')
        .mockImplementation((notes) => [notes.slice(1), [notes[0]]])

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
      gen.sequence.iteratePos((pos) => {
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
      const { seq, notePos } = arrangeSeq({ conf })
      expect(
        notePos.every((p) =>
          scale.pitches.includes(seq.sequence.notes[p][0].pitch as number)
        )
      ).toBe(true)
      scale.modulate({ key: 'D', pref: '_1M' }, 1)
      seq.adjustPitch()
      expect(
        getNotesPos(seq).every((p) =>
          scale.pitches.includes(seq.sequence.notes[p][0].pitch as number)
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
      expect(gen.sequence.notes).toMatchInlineSnapshot(`
        {
          "0": [
            {
              "dur": 1,
              "pitch": 60,
              "vel": 100,
            },
            {
              "dur": 1,
              "pitch": 67,
              "vel": 100,
            },
          ],
          "2": [
            {
              "dur": 1,
              "pitch": 62,
              "vel": 100,
            },
            {
              "dur": 1,
              "pitch": 69,
              "vel": 100,
            },
          ],
          "4": [
            {
              "dur": 1,
              "pitch": 80,
              "vel": 100,
            },
            {
              "dur": 1,
              "pitch": 72,
              "vel": 100,
            },
            {
              "dur": 1,
              "pitch": 88,
              "vel": 100,
            },
            {
              "dur": 1,
              "pitch": 79,
              "vel": 100,
            },
          ],
        }
      `)
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
    it(`should adjust notes after assigning initial notes`, () => {
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
              pitch: 60,
              vel: 100,
              dur: 1,
            },
          ],
          3: [
            {
              pitch: 60,
              vel: 100,
              dur: 1,
            },
          ],
        },
      })
      gen.scale.modulate({ key: 'D', pref: 'omit25' })
      gen.changeSequenceLength('shrink', 1)
      gen.resetNotes()
      expect(gen.sequence.notes[0][0]).toMatchObject({
        pitch: 61,
        vel: 100,
        dur: 1,
      })
      gen.sequence.iteratePos((p) => {
        expect(p).toBeLessThan(4)
      })
    })
  })
})
