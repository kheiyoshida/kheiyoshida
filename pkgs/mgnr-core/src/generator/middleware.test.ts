import { GeneratorContext } from './SequenceGenerator'
import { fillNoteConf } from './NotePicker'
import { Sequence } from '../entities/Sequence'
import { Scale } from '../source/Scale'
import { pingpongSequenceLength, removeNotesOutOfCapacity } from './middleware'

test(`${pingpongSequenceLength.name}`, () => {
  const sequence = new Sequence({ length: 8, lenRange: { min: 2, max: 12 } })
  const context: GeneratorContext = {
    sequence,
    scale: new Scale(),
    picker: fillNoteConf({}),
  }
  const change = pingpongSequenceLength('extend')
  expect(sequence.length).toBe(8)
  change(context, 3)
  expect(sequence.length).toBe(11)
  change(context, 3)
  expect(sequence.length).toBe(8)
  change(context, 3)
  expect(sequence.length).toBe(5)
  change(context, 3)
  expect(sequence.length).toBe(2)
  change(context, 3)
  expect(sequence.length).toBe(5)
})

test(`${removeNotesOutOfCapacity.name}`, () => {
  const sequence = new Sequence({ length: 8, density: 0.5 })
  sequence.replaceEntireNotes({
    0: [...Array(6)].map(() => ({
      pitch: 60,
      vel: 100,
      dur: 1
    }))
  })
  expect(sequence.availableSpace).toBe(-2)
  removeNotesOutOfCapacity({ sequence } as GeneratorContext)
  expect(sequence.availableSpace).toBeGreaterThanOrEqual(0)
})
