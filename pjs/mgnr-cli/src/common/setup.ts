import { MidiChannel } from 'mgnr-midi/src/Channel'
import { MidiOutlet } from 'mgnr-midi/src/Outlet'
import { MidiPort } from 'mgnr-midi/src/Port'
import { MidiChannelNumber } from 'mgnr-midi/src/types'

export function createChannelOutlet(port: MidiPort, chNumber: MidiChannelNumber) {
  const ch = new MidiChannel(port, chNumber)
  const outlet = new MidiOutlet(ch)
  return outlet
}
