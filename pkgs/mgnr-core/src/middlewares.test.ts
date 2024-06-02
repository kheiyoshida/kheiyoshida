import { GeneratorContext } from './Generator'
import { fillNoteConf } from './generator/NotePicker'
import { Sequence } from './generator/Sequence'
import { Scale } from './generator/scale/Scale'
import { pingpongSequenceLength } from './middlewares'

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
