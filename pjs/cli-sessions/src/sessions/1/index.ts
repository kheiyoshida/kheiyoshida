import * as mgnr from '@mgnr/cli'
import * as callbacks from '../../utils/callbacks.js'
import { padChOutlet, synthChOutlet, drumChOutlet } from './channels.js'
import { mutateInPlace, rand } from '../../utils/callbacks.js'
import { beat } from './patterns.js'

mgnr.Scheduler.multiEventsBufferInterval = 3

const key = mgnr.pickRandomPitchName()
const scale1 = new mgnr.CliScale('D#', 'omit25', { min: 52, max: 76 })
const scale2 = new mgnr.CliScale('D#', 'omit27', { min: 32, max: 68 })
const scale3 = new mgnr.CliScale([60, 62, 66])

const generator1 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 8,
    density: 0.5,
    division: 16,
    polyphony: 'mono',
  },
})

const generator2 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 6,
    density: 0.4,
    division: 16,
    polyphony: 'mono',
  },
})

const generator3 = new mgnr.CliSequenceGenerator({
  scale: scale2,
  sequence: {
    length: 4,
    division: 2,
    density: 1,
    polyphony: 'poly',
  },
  note: {
    duration: {
      min: 1,
      max: 2,
    },
  }
})

const generator4 = new mgnr.CliSequenceGenerator({
  scale: scale3,
  sequence: {
    length: 16,
    density: 0.4,
    division: 16,
  },
})

const generator5 = new mgnr.CliSequenceGenerator({
  scale: scale3,
  sequence: {
    length: 6,
    division: 16,
    density: 0.4,
  },
})

generator1.constructNotes()
generator2.constructNotes()
generator3.constructNotes()
generator4.constructNotes(beat)
generator5.constructNotes()

const port1 = synthChOutlet.assignGenerator(generator1)
const port2 = synthChOutlet.assignGenerator(generator2)

const port3 = padChOutlet.assignGenerator(generator3)

const port4 = drumChOutlet.assignGenerator(generator4)
const port5 = drumChOutlet.assignGenerator(generator5)

port1.loopSequence(4).onElapsed(callbacks.resetNotes).onEnded(callbacks.resetNotes)
port2.loopSequence(4)
port3.loopSequence(4).onElapsed(callbacks.mutateInPlace(0.3)).onEnded(callbacks.resetNotes)
port4.loopSequence(4).onEnded(callbacks.mutateInPlace(0.3))
port5.loopSequence(4).onEnded(callbacks.mutateInPlace(0.3))

const modulate =
  (key = mgnr.pickRandomPitchName(), stages = 4) =>
  () => {
    scale1.modulate({ key }, stages)
    scale2.modulate({ key }, stages)
  }

const actions = {
  ip3: mutateInPlace(0.3),
  rnd3: rand(0.3),
  mod: modulate,
}

export default function setup() {
  const start = () => mgnr.Scheduler.get().start()

  port1.logName = 'p1'
  port2.logName = 'p2'
  port3.logName = 'p3'
  port4.logName = 'p4'
  port5.logName = 'p5'
  scale1.logName = 's1'
  scale2.logName = 's2'
  scale3.logName = 's3'
  generator1.logName = 'g1'
  generator2.logName = 'g2'
  generator3.logName = 'g3'
  generator4.logName = 'g4'
  generator5.logName = 'g5'
  void mgnr.setupLogStream([port1, port2, port3, port4, port5], [scale1, scale2])

  mgnr.Time.bpm = 86
  start()

  return {
    ...callbacks,
    ...actions,
    start,
    beat,
    g1: generator1,
    g2: generator2,
    g3: generator3,
    g4: generator4,
    g5: generator5,

    p1: port1,
    p2: port2,
    p3: port3,
    p4: port4,
    p5: port5,

    s1: scale1,
    s2: scale2,
    s3: scale3,
  }
}
