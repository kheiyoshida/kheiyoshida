import * as mgnr from 'mgnr-core/src'
import { MidiChannel } from 'mgnr-midi/src/Channel'
import { MidiOutlet } from 'mgnr-midi/src/Outlet'
import { MidiPort } from 'mgnr-midi/src/Port'

export function main() {
  const port = new MidiPort('Logic Pro Virtual In', 120)

  const scale = mgnr.createScale('C', 'omit25', { min: 30, max: 80 })
  const generator = mgnr.createGenerator({
    division: 16,
    length: 64,
    noteDur: {
      min: 1,
      max: 4,
    },
    density: 0.8,
    scale,
  })
  generator.constructNotes()

  const ch1 = new MidiChannel(port, 1)
  const outlet1 = new MidiOutlet(ch1, generator)
  outlet1.loopSequence().onEnded((out) => {
    out.repeatLoop()
  })

  const generator2 = mgnr.createGenerator({
    scale: mgnr.createScale('C', 'major', { min: 30, max: 40 }),
    division: 4,
    length: 40,
    density: 0.8,
  })
  generator2.constructNotes({
    0: [{ pitch: 50, vel: 100, dur: 1 }],
  })
  const ch2 = new MidiChannel(port, 2)
  const outlet2 = new MidiOutlet(ch2, generator2)
  outlet2.loopSequence()
}
