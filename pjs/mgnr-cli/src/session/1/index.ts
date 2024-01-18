import { ScaleConf } from 'mgnr-core/src/generator/scale/Scale'
import { MidiPort } from 'mgnr-midi/src/Port'
import { createGenerator, createScale } from '../../common'
import { sendLogStream, sendStream } from '../../common/log'
import { createChannelOutlet } from '../../common/setup'

export function main() {
  const port = new MidiPort('Logic Pro Virtual In', 120)
  const outlet1 = createChannelOutlet(port, 1)
  const outlet2 = createChannelOutlet(port, 2)

  const s1 = createScale('C', 'major', { min: 40, max: 80 })
  const g1 = createGenerator({
    division: 16,
    length: 8,
    noteDur: {
      min: 1,
      max: 2,
    },
    noteVel: {
      min: 60,
      max: 100,
    },
    density: 0.5,
    fillPref: 'mono',
    scale: s1,
  })
  g1.feedOutlet(outlet1)
  outlet1.loopSequence().onEnded((ctx) => {
    g1.execLoop(s1)
    ctx.repeatLoop()
  })

  const s2 = createScale('C', 'omit25', { min: 30, max: 50 })
  const g2 = createGenerator({
    division: 16,
    length: 8,
    noteDur: {
      min: 3,
      max: 6,
    },
    noteVel: {
      min: 50,
      max: 100,
    },
    density: 0.5,
    fillPref: 'allowPoly',
    scale: s2,
  })
  g2.feedOutlet(outlet2)
  outlet2.loopSequence().onEnded(({ repeatLoop }) => {
    g2.execLoop(s2)
    repeatLoop()
  })

  s1.logName = 's1'
  s2.logName = 's2'
  g1.logName = 'g1'
  g2.logName = 'g2'
  sendLogStream([g1, g2], [s1, s2])

  return {
    g1,
    s1,
    g2,
    s2,
    adjust() {
      g1.adjustPitch()
      g2.adjustPitch()
    },
    mutateKey(key: ScaleConf['key'], stages = 1) {
      s1.mutateKey(key, stages)
      s2.mutateKey(key, stages)
    },
    sendLog: sendStream,
  }
}
