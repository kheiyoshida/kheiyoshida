import { Generator } from '../generator/Generator'
import { NotePicker } from '../generator/NotePicker'
import { Scale } from '../generator/Scale'
import { Sequence } from '../generator/Sequence'
import { Destination } from './Destination'
import { MusicGenerator } from './MusicGenerator'
import { Output } from './Output'
import { SeqEvent } from './SequenceEvent'
import { SequenceOut } from './SequenceOut'

class MockOutput extends Output<unknown> {
  public set(outId: string, generator: Generator, inst: unknown, events?: SeqEvent): void {
    this.outs[outId] = new MockSequenceOut(generator, inst, outId, events)
  }
}

class MockSequenceOut extends SequenceOut {
  public assignSequence(loop?: number, startTime?: number): void {
    return undefined
  }
}

type MockInst = unknown

class MockDestination extends Destination<MockInst> {
  output = new MockOutput()
}

const prepareMgnr = () => {
  const dest = new MockDestination()
  const mgnr = new MusicGenerator(dest)
  return { dest, mgnr }
}

describe(`${MusicGenerator.name}`, () => {
  describe(`${MusicGenerator.prototype.setSequenceOut.name}`, () => {
    it(`should set sequence out`, () => {
      const { mgnr, dest } = prepareMgnr()
      mgnr.setSequenceOut(new Generator(new NotePicker({}), new Sequence()), undefined, 'outId')
      expect(dest.output.outs['outId']).not.toBeUndefined()
    })
  })
  describe(`${MusicGenerator.prototype.changeSequenceLength.name}`, () => {
    it(`should change sequence's length`, () => {
      const { mgnr } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      mgnr.setSequenceOut(generator, undefined, 'outId')
      const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(true)
      mgnr.changeSequenceLength(generator, 'shrink', 8)
      expect(spyChange).toHaveBeenCalledWith('shrink', 8, true)
    })
    it(`should reverse the direction if sequence reached the length range limit`, () => {
      const { mgnr } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      mgnr.setSequenceOut(generator, undefined, 'outId')
      const spyChange = jest.spyOn(generator, 'changeSequenceLength').mockReturnValue(false)
      const spyToggle = jest.spyOn(generator, 'toggleReverse')
      mgnr.changeSequenceLength(generator, 'shrink', 4, 'reverse')
      expect(spyToggle).toHaveBeenCalled()
      expect(spyChange).toHaveBeenCalledTimes(2) // change length backward
    })
    it(`should erase the entire notes when erase flag enabled`, () => {
      const { mgnr } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      mgnr.setSequenceOut(generator, undefined, 'outId')
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
      const generator = new Generator(new NotePicker({}, scale), new Sequence())
      jest.spyOn(scale, 'modulate')
      mgnr.setSequenceOut(generator, undefined, 'outId')
      mgnr.modulateScale(scale, { key: 'D' }, 1)
      expect(scale.modulate).toHaveBeenCalled()
    })
  })
  describe(`${MusicGenerator.prototype.adjustPitch.name}`, () => {
    it(`should adjust pitches of generators that uses the same scale`, () => {
      const { mgnr } = prepareMgnr()
      const scale = new Scale()
      const generator = new Generator(new NotePicker({}, scale), new Sequence())
      const generator2 = new Generator(new NotePicker({}, scale), new Sequence())
      mgnr.setSequenceOut(generator, undefined, 'out1')
      mgnr.setSequenceOut(generator2, undefined, 'out2')
      jest.spyOn(generator, 'adjustPitch')
      jest.spyOn(generator2, 'adjustPitch')
      mgnr.adjustPitch(scale)
      expect(generator.adjustPitch).toHaveBeenCalled()
      expect(generator2.adjustPitch).toHaveBeenCalled()
    })
  })
  describe(`${MusicGenerator.prototype.handleTimeEvent.name}`, () => {
    it.todo(`should hanlde elapsed/ended evetns`)
  })
  describe(`${MusicGenerator.prototype.reassignSequence.name}`, () => {
    it(`should reassign sequence`, () => {
      const { mgnr, dest } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      mgnr.setSequenceOut(generator, undefined, 'outId')
      const out = dest.output.outs['outId']
      const spyAssign = jest.spyOn(out, 'assignSequence')
      mgnr.reassignSequence(out, 0, 4)
      expect(spyAssign).toHaveBeenCalled()
    })
  })
  describe(`${MusicGenerator.prototype.resetNotes.name}`, () => {
    it(`should reset notes`, () => {
      const { mgnr, dest } = prepareMgnr()
      const generator = new Generator(new NotePicker({}), new Sequence())
      mgnr.setSequenceOut(generator, undefined, 'outId')
      const out = dest.output.outs['outId']
      const spyReset = jest.spyOn(generator, 'resetNotes')
      mgnr.resetNotes(out)
      expect(spyReset).toHaveBeenCalled()
    })
  })
})
