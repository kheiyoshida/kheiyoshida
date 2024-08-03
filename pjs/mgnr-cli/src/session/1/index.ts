import { createGenerator, createScale, ScaleConf } from 'mgnr-core'
import { MidiPort } from 'mgnr-midi/src/Port'
import { sendStream, setupLogStream } from '../../common/log'
import { createChannelOutlet } from '../../common/setup'

export function main() {
  const port = new MidiPort('Logic Pro Virtual In', 120)
  const outlet1 = createChannelOutlet(port, 1)
  const outlet2 = createChannelOutlet(port, 2)
  const outlet3 = createChannelOutlet(port, 3)

  const s1 = createScale('C', 'major', { min: 50, max: 80 })
  const g1 = createGenerator({
    sequence: {
      division: 16,
      length: 8,
      density: 0.5,
      fillStrategy: 'fill',
      polyphony: 'mono'
    },
    note: {
      velocity: {
        min: 60,
        max: 100,
      },
      duration: {
        min: 1,
        max: 2,
      }
    },
    scale: s1,
  })

  const op1 = outlet1.assignGenerator(g1)
  op1.loopSequence()

  // const g2 = createGenerator({
  //   division: 16,
  //   length: 12,
  //   noteDur: 1,
  //   noteVel: {
  //     min: 40,
  //     max: 80,
  //   },
  //   density: 0.5,
  //   fillPref: 'mono',
  //   fillStrategy: 'fill',
  //   scale: s1,
  // })
  // g2.feedOutlet(outlet2)
  // outlet2.loopSequence().onEnded((ctx) => {
  //   g2.execLoop(s1)
  //   ctx.repeatLoop()
  // })

  // const s2 = createScale('C', 'omit25', { min: 34, max: 60 })
  // const g3 = createGenerator({
  //   division: 16,
  //   length: 8,
  //   noteDur: {
  //     min: 3,
  //     max: 6,
  //   },
  //   noteVel: {
  //     min: 50,
  //     max: 100,
  //   },
  //   density: 0.5,
  //   fillPref: 'allowPoly',
  //   scale: s2,
  // })
  // g3.feedOutlet(outlet3)
  // outlet3.loopSequence().onEnded(({ repeatLoop }) => {
  //   g3.execLoop(s2)
  //   repeatLoop()
  // })

  // s1.logName = 's1_high'
  // s2.logName = 's2_low'
  // g1.logName = 'g1'
  // g2.logName = 'g2'
  // g3.logName = 'g3'
  // setupLogStream([g1, g2, g3], [s1, s2])

  return {
    g1,
  }
}
