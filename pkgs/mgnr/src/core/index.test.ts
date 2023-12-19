import { Generator } from './generator/Generator'
import { NotePicker } from './generator/NotePicker'
import { Scale } from './generator/Scale'
import { Sequence } from './generator/Sequence'
import * as mgnr from '.'

describe(`${mgnr.createGenerator.name}`, () => {
  const generator = mgnr.createGenerator({
    fillPref: 'mono',
    scale: new Scale({ key: 'D' }),
  })
  expect(generator).toBeInstanceOf(Generator)
})

describe(`${mgnr.changeSequenceLength.name}`, () => {
  it(`should change sequence's length`, () => {
    const generator = new Generator(new NotePicker({}), new Sequence())
    const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(true)
    mgnr.changeSequenceLength(generator, 'shrink', 8)
    expect(spyChange).toHaveBeenCalledWith('shrink', 8, true)
  })
  it(`should reverse the direction if sequence reached the length range limit`, () => {
    const generator = new Generator(new NotePicker({}), new Sequence())
    const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(false)
    const spyToggle = jest.spyOn(generator, 'toggleReverse')
    mgnr.changeSequenceLength(generator, 'shrink', 4, 'reverse')
    expect(spyToggle).toHaveBeenCalled()
    expect(spyChange).toHaveBeenCalledTimes(2) // change length backward
  })
  it(`should erase the entire notes when erase flag enabled`, () => {
    const generator = new Generator(new NotePicker({}), new Sequence())
    const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(false)
    const spyToggle = jest.spyOn(generator, 'toggleReverse')
    const spyErase = jest.spyOn(generator, 'eraseSequenceNotes')
    mgnr.changeSequenceLength(generator, 'shrink', 4, 'erase')
    expect(spyToggle).not.toHaveBeenCalled()
    expect(spyChange).toHaveBeenCalledTimes(1)
    expect(spyErase).toHaveBeenCalled()
  })
})
