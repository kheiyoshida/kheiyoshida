import * as Tone from 'tone'
import { mockScheduleLoop } from './__tests__/mock'
import { SequenceGenerator } from 'mgnr-core/src/generator/Generator'
import { NotePicker } from 'mgnr-core/src/generator/NotePicker'
import { Sequence, SequenceNoteMap } from 'mgnr-core/src/generator/Sequence'
import { ToneOutlet } from './Outlet'
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
  it(`can create multiple ports and notes can be handled by monophonic manager`, () => {
    const inst = new Tone.Synth()
    const outlet = new ToneOutlet(inst, true)
    const notes1: SequenceNoteMap = {
      0: [
        {
          vel: 100,
          pitch: 60,
          dur: 4,
        },
      ],
    }
    const port1 = outlet.createPort(prepareGeneratorWithNotes(notes1))
    const notes2: SequenceNoteMap = {
      2: [
        {
          vel: 100,
          pitch: 60,
          dur: 4,
        },
      ],
    }
    const port2 = outlet.createPort(prepareGeneratorWithNotes(notes2))

    const spyInstTrigger = jest.spyOn(inst, 'triggerAttackRelease').mockImplementation(jest.fn())
    const spyAssign = jest.spyOn(outlet, 'assignNote')

    // act
    port1.loopSequence(1)
    port2.loopSequence(1)

    // assert
    expect(spyAssign).toHaveBeenCalledTimes(2)
    expect(spyInstTrigger.mock.calls).toMatchObject([
      // port 1
      ['C4', 0.25, 0, expect.any(Number)],
      // port 2
      [
        'C4',
        0.125,
        0.25, // should come after first note
        expect.any(Number),
      ],
    ])
    /**
     * 0             0.25
     * 0 | 1 | 2 | 3 | 4 | 5 |
     * [----note1----]
     *       [-----note2-----]
     *               [-note2`]
     */
  })
})
