import * as mgnr from './commands'
import { SequenceGenerator } from './generator/Generator'
import { Scale } from './generator/Scale'

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
