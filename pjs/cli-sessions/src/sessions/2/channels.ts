import * as mgnr from '@mgnr/cli'

mgnr.Scheduler.multiEventsBufferInterval = 3

const midiPort = new mgnr.MidiPort('Logic Pro Virtual In')
midiPort.configureExitHandlers()

const ch1 = new mgnr.MidiChannel(midiPort, 1)
const ch2 = new mgnr.MidiChannel(midiPort, 2)
const ch3 = new mgnr.MidiChannel(midiPort, 3)
const ch4 = new mgnr.MidiChannel(midiPort, 4)

export const padChOutlet = new mgnr.CliMidiChOutlet(ch1)
export const synthChOutlet = new mgnr.CliMidiChOutlet(ch2)
export const drumChOutlet = new mgnr.CliMidiChOutlet(ch3)
export const bassChOutlet = new mgnr.CliMidiChOutlet(ch4)
