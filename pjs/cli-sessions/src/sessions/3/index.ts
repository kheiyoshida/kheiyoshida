import * as mgnr from '@mgnr/cli'
import * as callbacks from '../../utils/callbacks.ts'
import { mutateInPlace, rand } from '../../utils/callbacks.ts'
import { drumChOutlet, padChOutlet, synthChOutlet } from './channels.ts'
import { GeneratorParameter, ScaleParameter, setupAnalogInput } from '../../utils/analogInput.ts'
import { hh1, hh2, kick1, kick2, snare1, snare2 } from './config.ts'
import { beat1, beat2, beat3, beat4 } from './patterns.ts'

mgnr.Scheduler.multiEventsBufferInterval = 5

// const key = mgnr.pickRandomPitchName()
const key = 'G#'
const scale1 = new mgnr.CliScale(key, 'omit25', { min: 40, max: 64 })
const scale2 = new mgnr.CliScale(key, 'omit25', { min: 32, max: 68 })
const scale3 = new mgnr.CliScale([kick1, kick2, snare1, snare2, hh1, hh2])

const pad1 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 8,
    division: 2,
    density: 0.5,
  },
  note: {
    duration: 2,
    velocity: {
      min: 80,
      max: 100,
    },
  },
})

const pad2 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 8,
    division: 2,
    density: 0.5,
  },
  note: {
    duration: {
      min: 1,
      max: 2,
    },
    velocity: {
      min: 80,
      max: 100,
    },
  },
})

const syn1 = new mgnr.CliSequenceGenerator({
  scale: scale2,
  sequence: {
    length: 8,
    density: 0.25,
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

const syn2 = new mgnr.CliSequenceGenerator({
  scale: scale2,
  sequence: {
    length: 6,
    density: 0.3,
    division: 16,
    polyphony: 'mono',
  },
  note: {
    duration: 1,
  },
})

const drums1 = new mgnr.CliSequenceGenerator({
  scale: scale3,
  sequence: {
    length: 16,
    density: 0.25,
    division: 16,
    polyphony: 'mono',
  },
})

const drums2 = new mgnr.CliSequenceGenerator({
  scale: scale3,
  sequence: {
    length: 10,
    division: 16,
    density: 0.25,
    polyphony: 'mono',
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

pad1.constructNotes()
pad2.constructNotes()
syn1.constructNotes()
syn2.constructNotes()
// drums1.constructNotes()
// drums2.constructNotes(beat)

const padPort1 = padChOutlet.assignGenerator(pad1)
const padPort2 = padChOutlet.assignGenerator(pad2)
const synPort1 = synthChOutlet.assignGenerator(syn1)
const synPort2 = synthChOutlet.assignGenerator(syn2)
const drumPort1 = drumChOutlet.assignGenerator(drums1)
const drumPort2 = drumChOutlet.assignGenerator(drums2)

padPort1.loopSequence(4).onElapsed((g) => g.mutate({ strategy: 'inPlace', rate: 0.5 }))
padPort2.loopSequence(4).onElapsed((g) => g.mutate({ strategy: 'inPlace', rate: 0.5 }))
// .onElapsed((g) => g.mutate({ strategy: 'move', rate: 0.3 }))
// .onEnded(resetNotes)

synPort1
  .loopSequence(4)
  .onElapsed((g) => g.mutate({ strategy: 'inPlace', rate: 0.3 }))
  .onEnded((g) => g.mutate({ strategy: 'randomize', rate: 0.3 }))
synPort2
  .loopSequence(4)
  .onElapsed((g) => g.mutate({ strategy: 'inPlace', rate: 0.3 }))
  .onEnded((g) => g.mutate({ strategy: 'randomize', rate: 0.5 }))

drumPort1.loopSequence(4) //.onEnded((g) => g.resetNotes(beat))
drumPort2.loopSequence(4)

const generators = [pad1, pad2, syn1, syn2, drums1, drums2]
const scales = [scale1, scale2]
setupAnalogInput(({ target, valueType, value }) => {
  console.log(`(analog input) target: ${target} valueType: ${valueType} value: ${value}`)
  try {
    if (target < generators.length) {
      const generator = generators[target]
      if (valueType === GeneratorParameter.Density) {
        generator.updateDensity(value)
      } else if (valueType === GeneratorParameter.SequenceLength) {
        const diff = value - generator.sequence.length
        if (value > 0) {
          generator.sequence.extend(diff)
        } else if (value < 0) {
          generator.sequence.shrink(diff)
        }
      }
    } else {
      const scale = scales[target - generators.length]
      if (valueType === ScaleParameter.Low) {
        scale.low = value
      } else if (valueType === ScaleParameter.High) {
        scale.high = value
      }
    }
  } catch (error) {
    console.error((error as Error).message)
  }
})

const actions = {
  ip3: mutateInPlace(0.3),
  rnd3: rand(0.3),
}

export default function setup() {
  const start = () => mgnr.Scheduler.get().start()

  padPort1.logName = 'p1'
  padPort2.logName = 'p2'

  synPort1.logName = 'p3'
  synPort2.logName = 'p4'

  drumPort1.logName = 'p5'
  drumPort2.logName = 'p6'

  scale1.logName = 's1'
  scale2.logName = 's2'
  scale3.logName = 's3'

  pad1.logName = 'g1'
  pad2.logName = 'g2'

  syn1.logName = 'g3'
  syn2.logName = 'g4'

  drums1.logName = 'g5'
  drums2.logName = 'g6'

  void mgnr.setupLogStream([padPort1, padPort2, synPort1, synPort2, drumPort1, drumPort2], [scale1, scale2])

  mgnr.Time.bpm = 134
  start()

  return {
    ...callbacks,
    ...actions,
    start,
    ub,
    beat,
    g1: pad1,
    g2: pad2,
    g3: syn1,
    g4: syn2,
    g5: drums1,
    g6: drums2,

    p1: padPort1,
    p2: padPort2,
    p3: synPort1,
    p4: synPort2,
    p5: drumPort1,
    p6: drumPort2,

    s1: scale1,
    s2: scale2,
    s3: scale3,
  }
}
