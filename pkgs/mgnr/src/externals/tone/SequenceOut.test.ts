import { mockScheduleLoop } from '../../__tests__/mock'
import * as Tone from 'tone'
import { Generator } from '../../generator/Generator'
import { ToneSequenceOut } from './SequenceOut'
import * as wrapperUtil from './tone-wrapper/utils'
import { NotePicker } from '../../generator/NotePicker'
import { Sequence } from '../../generator/Sequence'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('./tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('./tone-wrapper/Transport')>(
    './tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
}))

describe(`${ToneSequenceOut.name}`, () => {
  const defaultNotes = {
    0: [
      {
        vel: 100,
        pitch: 60,
        dur: 1,
      },
    ],
  }
  const prepare = (notes = defaultNotes) => {
    const generator = new Generator(
      new NotePicker({fillStrategy: 'fixed'}),
      new Sequence()
    )
    generator.constructNotes(notes)
    
    const inst = new Tone.PolySynth()
    const outId = 'outId'
    const seqOut = new ToneSequenceOut(generator, inst, outId)
    return { seqOut, generator, inst, outId }
  }
  let spyScheduleLoop: jest.SpyInstance
  beforeEach(() => {
    spyScheduleLoop = jest.spyOn(wrapperUtil, 'scheduleLoop').mockImplementation(mockScheduleLoop)
  })
  it(`can assign sequence to inst`, () => {
    const { seqOut, inst } = prepare()
    seqOut.assignSequence(4, 0)
    expect(spyScheduleLoop.mock.calls[0].slice(1)).toMatchObject([
      1, // duration
      0, // startTime
      4, // numOfLoops
    ])
    ;(inst.triggerAttackRelease as jest.Mock).mock.calls.forEach(
      ([pitch, duration, time, velocity], i) => {
        expect(pitch).toBe('C4')
        expect(duration).toBe(FIXED_SECONDS_PER_MEASURE / 16)
        expect(time).toBe(i)
        expect(velocity).toBeLessThan(1)
      }
    )
  })
})
