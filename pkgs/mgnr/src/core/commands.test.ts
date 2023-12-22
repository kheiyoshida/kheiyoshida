import * as mgnr from './commands'
import { SequenceGenerator } from './generator/Generator'
import { NotePicker } from './generator/NotePicker'
import { Scale } from './generator/Scale'
import { Sequence } from './generator/Sequence'

test(`${mgnr.createScale.name}`, () => {
  expect(() => mgnr.createScale('C')).not.toThrow()
  expect(() => mgnr.createScale({})).not.toThrow()
  expect(() =>
    mgnr.createScale({ key: 'C', pref: 'major', range: { min: 30, max: 80 } })
  ).not.toThrow()
})

test(`${mgnr.createGenerator.name}`, () => {
  const generator = mgnr.createGenerator({
    fillPref: 'mono',
    scale: new Scale({ key: 'D' }),
  })
  expect(generator).toBeInstanceOf(SequenceGenerator)
})


test(`${mgnr.pingpongSequenceLength.name}`, () => {
  const lengthChange = mgnr.pingpongSequenceLength('extend')
  const sequence = new Sequence({length: 8, lenRange: {min: 4, max: 12}})
  const generator = new SequenceGenerator(new NotePicker(), sequence)
  expect(sequence.length).toBe(8)
  lengthChange(generator, 3)
  expect(sequence.length).toBe(11)
  lengthChange(generator, 3)
  expect(sequence.length).toBe(8)
  lengthChange(generator, 3)
  expect(sequence.length).toBe(5)
  lengthChange(generator, 3)
  expect(sequence.length).toBe(8)
  lengthChange(generator, 3)
  expect(sequence.length).toBe(11)
})