import * as core from 'mgnr-core/src'
import { SequenceNoteMap } from 'mgnr-core/src/generator/Sequence'
import { MidiChannel } from './Channel'
import { MidiOutlet } from './Outlet'
import { MidiPort } from './Port'
import { mockOutputPorts } from './__tests__/mock'

jest.mock('easymidi')
beforeAll(mockOutputPorts)

describe(`${MidiOutlet.name}`, () => {
  it(`can be created with a midi channel`, () => {
    const port = new MidiPort('midi port 1', 120)
    const ch = new MidiChannel(port, 1)
    const outlet = new MidiOutlet(ch)
    expect(outlet.midiCh).toBe(ch)
  })
  it(`can be fed by a generator`, () => {
    const port = new MidiPort('midi port 1', 120)
    const ch = new MidiChannel(port, 1)
    const outlet = new MidiOutlet(ch)
    const generator = core.createGenerator({})
    generator.feedOutlet(outlet)
    expect(outlet.generator).toBe(generator)
  })
  it(`can loop sequence to send each note to the midi channel`, () => {
    const port = new MidiPort('midi port 1', 120)
    const ch = new MidiChannel(port, 1)
    const outlet = new MidiOutlet(ch)
    const generator = core.createGenerator({
      fillStrategy: 'fixed',
      division: 8,
    })
    generator.feedOutlet(outlet)
    const noteMap: SequenceNoteMap = {
      0: [
        {
          pitch: 60,
          vel: 100,
          dur: 1,
        },
      ],
      3: [
        {
          pitch: 67,
          vel: 100,
          dur: 2,
        },
      ],
    }
    generator.constructNotes(noteMap)
    const spySendNote = jest.spyOn(ch, 'sendNote').mockImplementation()
    outlet.loopSequence()
    expect(spySendNote).toHaveBeenCalledTimes(2)
    expect(spySendNote).toHaveBeenCalledWith(noteMap[0][0], 0, 1 / 8)
    expect(spySendNote).toHaveBeenCalledWith(noteMap[3][0], 3 / 8, 5 / 8)
  })
})
