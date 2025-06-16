import * as mgnr from '@mgnr/cli'

mgnr.Scheduler.multiEventsBufferInterval = 3

const midiPort = new mgnr.MidiPort('Logic Pro Virtual In')
midiPort.configureExitHandlers()

const ch1 = new mgnr.MidiChannel(midiPort, 1)
const ch2 = new mgnr.MidiChannel(midiPort, 2)

const drumChannels = new mgnr.LayeredMidiChannelGroup(midiPort, [
  [3, 20, 60],
  [4, 61, 80],
  [5, 81, 120],
])

export const drumChOutlet = new mgnr.CliMidiChOutlet(drumChannels)
export const padChOutlet = new mgnr.CliMidiChOutlet(ch1)
export const synthChOutlet = new mgnr.CliMidiChOutlet(ch2)
