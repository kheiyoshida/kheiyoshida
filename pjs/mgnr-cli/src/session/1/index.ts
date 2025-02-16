import { MidiPort } from 'mgnr-midi/src/Port'
import { createCliGenerator } from '../../common/wrappers'
import { createScale } from '../../common'
import { setupLogStream } from '../../common/log'

export function main() {
  const [chOut1, chOut2] = new MidiPort('Logic Pro Virtual In', 120).getChannelOutlets()

  const s1 = createScale('C', 'major', { min: 50, max: 80 })
  const g1 = createCliGenerator({
    sequence: {
      division: 16,
      length: 8,
      density: 0.5,
      fillStrategy: 'fill',
      polyphony: 'mono',
    },
    note: {
      velocity: {
        min: 60,
        max: 100,
      },
      duration: {
        min: 1,
        max: 2,
      },
    },
    scale: s1,
  })

  const g2 = createCliGenerator({
    sequence: {
      division: 16,
      length: 8,
      density: 0.5,
      fillStrategy: 'fill',
      polyphony: 'mono',
    },
    note: {
      velocity: {
        min: 60,
        max: 100,
      },
      duration: {
        min: 1,
        max: 2,
      },
    },
    scale: s1,
  })

  const outletPort1 = chOut1.assignGenerator(g1)
  const outletPort2 = chOut2.assignGenerator(g2)

  setupLogStream([outletPort1, outletPort2], [s1])

  return {
    s1,
    g1,
    p1: outletPort1,
    p2: outletPort2,
  }
}
