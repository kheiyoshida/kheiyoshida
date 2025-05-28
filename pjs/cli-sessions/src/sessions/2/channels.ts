import * as mgnr from '@mgnr/cli'

mgnr.Scheduler.multiEventsBufferInterval = 3

const midiPort = new mgnr.MidiPort('Logic Pro Virtual In')
midiPort.configureExitHandlers()

const drumChannels = new mgnr.LayeredMidiChannelGroup(midiPort, [
  [1, 20, 60],
  [2, 61, 80],
  [3, 81, 120],
])
const ch4 = new mgnr.MidiChannel(midiPort, 4)
const ch5 = new mgnr.MidiChannel(midiPort, 5)

export const drumChOutlet = new mgnr.CliMidiChOutlet(drumChannels)
export const padChOutlet = new mgnr.CliMidiChOutlet(ch4)
export const synthChOutlet = new mgnr.CliMidiChOutlet(ch5)
