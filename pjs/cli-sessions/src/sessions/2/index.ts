import * as mgnr from '@mgnr/cli'
import * as callbacks from '../../utils/callbacks.js'
import { mutateInPlace, rand, resetNotes } from '../../utils/callbacks.js'
import { drumChOutlet, padChOutlet, synthChOutlet } from './channels.js'
import { setupAnalogInput } from '../../utils/analogInput.js'
import { hh1, hh2, kick, snare } from './config.js'
import { beat1, beat2, beat3, beat4 } from './patterns.js'

mgnr.Scheduler.multiEventsBufferInterval = 5

const key = mgnr.pickRandomPitchName()
const scale1 = new mgnr.CliScale(key, 'omit25', { min: 48, max: 72 })
const scale2 = new mgnr.CliScale(key, 'omit27', { min: 32, max: 68 })
const scale3 = new mgnr.CliScale([kick, snare, hh1, hh2])

const flute1 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 8,
    density: 0.25,
    division: 16,
    polyphony: 'mono',
  },
  note: {
    duration: {
      min: 1,
      max: 4,
    },
  },
})

const flute2 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 6,
    density: 0.3,
    division: 16,
    polyphony: 'mono',
  },
  note: {
    duration: {
      min: 1,
      max: 2,
    },
  },
})

const pad = new mgnr.CliSequenceGenerator({
  scale: scale2,
  sequence: {
    length: 8,
    division: 1,
    density: 1,
    polyphony: 'poly',
  },
  note: {
    duration: 2,
  },
})

const drums1 = new mgnr.CliSequenceGenerator({
  scale: scale3,
  sequence: {
    length: 16,
    density: 0.4,
    division: 16,
  },
})

const drums2 = new mgnr.CliSequenceGenerator({
  scale: scale3,
  sequence: {
    length: 10,
    division: 16,
    density: 0.25,
  },
})

let beat = beat1
const ub = (pattern: 1 | 2 | 3 | 4) => {
  switch (pattern) {
    case 1:
      return (beat = beat1)
    case 2:
      return (beat = beat2)
    case 3:
      return (beat = beat3)
    case 4:
      return (beat = beat4)
  }
}

// flute1.constructNotes()
// flute2.constructNotes()
pad.constructNotes()
// drums1.constructNotes(beat)
// drums2.constructNotes()

const port1 = synthChOutlet.assignGenerator(flute1)
const port2 = synthChOutlet.assignGenerator(flute2)
const padPort = padChOutlet.assignGenerator(pad)
const drumPort1 = drumChOutlet.assignGenerator(drums1)
const drumPort2 = drumChOutlet.assignGenerator(drums2)

port1.loopSequence(4)
port2.loopSequence(4)
padPort
  .loopSequence(4)
  .onElapsed((g) => g.mutate({ strategy: 'move', rate: 0.3 }))
  .onEnded(resetNotes)
drumPort1.loopSequence(4).onEnded((g) => g.resetNotes(beat))
drumPort2.loopSequence(4)

const generators = [flute1, flute2, pad, drums1, drums2]
setupAnalogInput(({ target, value }) => {
  try {
    const generator = generators[target - 1]
    generator.updateDensity(value)
  } catch (error) {
    console.error((error as Error).message)
  }
})

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
  padPort.logName = 'p3'
  drumPort1.logName = 'p4'
  drumPort2.logName = 'p5'
  scale1.logName = 's1'
  scale2.logName = 's2'
  scale3.logName = 's3'
  flute1.logName = 'g1'
  flute2.logName = 'g2'
  pad.logName = 'g3'
  drums1.logName = 'g4'
  drums2.logName = 'g5'
  void mgnr.setupLogStream([port1, port2, padPort, drumPort1, drumPort2], [scale1, scale2])

  mgnr.Time.bpm = 134
  start()

  return {
    ...callbacks,
    ...actions,
    start,
    ub,
    beat,
    g1: flute1,
    g2: flute2,
    g3: pad,
    g4: drums1,
    g5: drums2,

    p1: port1,
    p2: port2,
    p3: padPort,
    p4: drumPort1,
    p5: drumPort2,

    s1: scale1,
    s2: scale2,
    s3: scale3,
  }
}
