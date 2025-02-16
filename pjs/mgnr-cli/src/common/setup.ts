import { MidiChOutlet } from 'mgnr-midi/src/Outlet'
import { MidiPort } from 'mgnr-midi/src/Port'
import { MidiChannelNumber } from 'mgnr-midi/src/types'

export function createMidiChannelOutlet(port: MidiPort, chNumber: MidiChannelNumber) {
  return new MidiChOutlet(port, chNumber)
}
