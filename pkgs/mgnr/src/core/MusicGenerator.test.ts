import { Generator } from '../generator/Generator'
import { NotePicker } from '../generator/NotePicker'
import { Scale } from '../generator/Scale'
import { Sequence } from '../generator/Sequence'
import { MusicGenerator } from './MusicGenerator'

const prepareMgnr = () => {
  const mgnr = new MusicGenerator()
  return { mgnr }
}

describe(`${MusicGenerator.name}`, () => {
  describe(`${MusicGenerator.prototype.createGenerator.name}`, () => {
    const { mgnr } = prepareMgnr()
    const generator = mgnr.createGenerator({
      fillPref: 'mono',
      scale: new Scale({ key: 'D' }),
    })
    expect(generator).toBeInstanceOf(Generator)
  })
  describe(`${MusicGenerator.prototype.changeSequenceLength.name}`, () => {
    it(`should change sequence's length`, () => {
      const { mgnr } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(true)
      mgnr.changeSequenceLength(generator, 'shrink', 8)
      expect(spyChange).toHaveBeenCalledWith('shrink', 8, true)
    })
    it(`should reverse the direction if sequence reached the length range limit`, () => {
      const { mgnr } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(false)
      const spyToggle = jest.spyOn(generator, 'toggleReverse')
      mgnr.changeSequenceLength(generator, 'shrink', 4, 'reverse')
      expect(spyToggle).toHaveBeenCalled()
      expect(spyChange).toHaveBeenCalledTimes(2) // change length backward
    })
    it(`should erase the entire notes when erase flag enabled`, () => {
      const { mgnr } = prepareMgnr()
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
  describe(`${MusicGenerator.prototype.modulateScale.name}`, () => {
    it(`should modulate scale`, () => {
      const { mgnr } = prepareMgnr()
      const scale = new Scale()
      jest.spyOn(scale, 'modulate')
      mgnr.modulateScale(scale, { key: 'D' }, 1)
      expect(scale.modulate).toHaveBeenCalled()
    })
  })
  describe(`${MusicGenerator.prototype.adjustPitch.name}`, () => {
    it(`should adjust pitches of generators that uses the same scale`, () => {
      const { mgnr } = prepareMgnr()
      const scale = new Scale()
      const generator = mgnr.createGenerator({ scale })
      const generator2 = mgnr.createGenerator({ scale })
      jest.spyOn(generator, 'adjustPitch')
      jest.spyOn(generator2, 'adjustPitch')
      mgnr.adjustPitch(scale)
      expect(generator.adjustPitch).toHaveBeenCalled()
      expect(generator2.adjustPitch).toHaveBeenCalled()
    })
  })
})
