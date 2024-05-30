import * as Tone from 'tone'
import { mockScheduleLoop } from './__tests__/mock'
import { SequenceGenerator } from 'mgnr-core/src/generator/Generator'
import { NotePicker } from 'mgnr-core/src/generator/NotePicker'
import { Sequence, SequenceNoteMap } from 'mgnr-core/src/generator/Sequence'
import { ToneOutlet } from './Outlet'
import { ToneOutletPort } from './OutletPort'
import * as wrapperUtil from './tone-wrapper/utils'

jest.mock('tone')

export const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('./tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('./tone-wrapper/Transport')>(
    './tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
}))

describe(`${ToneOutletPort.name}`, () => {
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
  it(`assigns notes`, () => {
    const { outlet } = prepareOutlet()
    const port = outlet.assignGenerator(prepareGeneratorWithNotes())
    const spyOutletAssign = jest.spyOn(outlet, 'sendNote').mockImplementation(() => undefined)
    port.loopSequence(4, 0)
    expect(spyScheduleLoop.mock.calls[0].slice(1)).toMatchObject([
      1, // duration
      0, // startTime
      4, // numOfLoops
    ])
    expect(spyOutletAssign).toHaveBeenCalledWith(60, expect.any(Number), expect.any(Number), 100)
  })
  it(`should trigger elapsed events on each loop`, () => {
    const eventHandler = jest.fn()
    const { outlet } = prepareOutlet()
    const port = outlet.assignGenerator(prepareGeneratorWithNotes())
    port.onElapsed(eventHandler)
    port.loopSequence(4, 0)
    expect(eventHandler).toHaveBeenCalledTimes(4)
  })
  it(`should trigger ended event when loop ends`, () => {
    const eventHandler = jest.fn()
    const { outlet } = prepareOutlet()
    const port = outlet.assignGenerator(prepareGeneratorWithNotes())
    port.onEnded(eventHandler)
    port.loopSequence(4, 0)
    expect(eventHandler).toHaveBeenCalledTimes(1)
  })
})
