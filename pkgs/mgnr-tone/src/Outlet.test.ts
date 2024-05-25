import * as Tone from 'tone'
import { mockScheduleLoop } from './__tests__/mock'
import { SequenceGenerator } from 'mgnr-core/src/generator/Generator'
import { NotePicker } from 'mgnr-core/src/generator/NotePicker'
import { Sequence, SequenceNoteMap } from 'mgnr-core/src/generator/Sequence'
import { MonoOutlet, ToneOutlet } from './Outlet'
import * as wrapperUtil from './tone-wrapper/utils'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('./tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('./tone-wrapper/Transport')>(
    './tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
}))

describe(`${ToneOutlet.name}`, () => {
  const prepareGeneratorWithNotes = (notes = defaultNotes) => {
    const generator = new SequenceGenerator(
      new NotePicker({ fillStrategy: 'fixed' }),
      new Sequence()
    )
    generator.constructNotes(notes)
    return generator
  }
  const defaultNotes: SequenceNoteMap = {
    0: [
      {
        vel: 100,
        pitch: 60,
        dur: 1,
      },
    ],
  }
  const prepareOutlet = () => {
    const inst = new Tone.PolySynth()
    const outlet = new ToneOutlet(inst)
    return { outlet, inst }
  }
  let spyScheduleLoop: jest.SpyInstance
  beforeEach(() => {
    spyScheduleLoop = jest.spyOn(wrapperUtil, 'scheduleLoop').mockImplementation(mockScheduleLoop)
  })
  it(`creates port that can assign notes`, () => {
    const { outlet } = prepareOutlet()
    const port = outlet.createPort(prepareGeneratorWithNotes())
    const spyOutletAssign = jest.spyOn(outlet, 'assignNote').mockImplementation(() => undefined)
    port.loopSequence(4, 0)
    expect(spyScheduleLoop.mock.calls[0].slice(1)).toMatchObject([
      1, // duration
      0, // startTime
      4, // numOfLoops
    ])
    expect(spyOutletAssign).toHaveBeenCalledWith(
      60,
      expect.any(Number),
      expect.any(Number),
      100
    )
  })
  it(`should trigger elapsed events on each loop`, () => {
    const eventHandler = jest.fn()
    const { outlet } = prepareOutlet()
    const port = outlet.createPort(prepareGeneratorWithNotes())
    port.onElapsed(eventHandler)
    port.loopSequence(4, 0)
    expect(eventHandler).toHaveBeenCalledTimes(4)
  })
})

describe(`${MonoOutlet.name}`, () => {
  
})