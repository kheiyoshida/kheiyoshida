import * as mgnr from '@mgnr/cli'

const midiPort = new mgnr.MidiPort('Logic Pro Virtual In')
midiPort.configureExitHandlers()
const ch1 = new mgnr.MidiChannel(midiPort, 1)
const ch2 = new mgnr.MidiChannel(midiPort, 2)

const outlet1 = new mgnr.MidiChOutlet(ch1)
const outlet2 = new mgnr.MidiChOutlet(ch2)

const scale1 = new mgnr.CliScale('C', 'major', { min: 48, max: 80 })
const scale2 = new mgnr.CliScale('C', 'omit25', { min: 32, max: 72 })

const generator1 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 10,
    density: 0.4,
    division: 16,
  },
  note: {
    duration: {
      min: 1,
      max: 2,
    },
  },
})

const generator2 = new mgnr.CliSequenceGenerator({
  scale: scale1,
  sequence: {
    length: 6,
    density: 0.5,
    division: 16,
    polyphony: 'mono',
  },
  note: {
    duration: 1,
  },
})

const generator3 = new mgnr.CliSequenceGenerator({
  scale: scale2,
  sequence: {
    length: 4,
    division: 2,
    density: 1,
  },
})

;[generator1, generator2, generator3].forEach((g) => g.constructNotes())

const port1 = outlet1.assignGenerator(generator1)
const port2 = outlet1.assignGenerator(generator2)
const port3 = outlet2.assignGenerator(generator3)

port1.loopSequence(2).onEnded((g) => g.mutate({ rate: 0.3, strategy: 'inPlace' }))
port2.loopSequence(2).onEnded((g) => g.mutate({ rate: 0.3, strategy: 'inPlace' }))
port3
  .loopSequence(2)
  .onElapsed((g) => g.mutate({ rate: 0.3, strategy: 'randomize' }))
  .onEnded((g) => g.resetNotes())

export default function setup() {
  mgnr.Time.bpm = 96
  mgnr.Scheduler.get().start()

  scale1.logName = 's1'
  generator1.logName = 'g1'
  generator2.logName = 'g2'
  generator3.logName = 'g3'
  void mgnr.setupLogStream([generator1, generator2, generator3], [scale1, scale2])

  return {
    g1: generator1,
    g2: generator2,
    g3: generator3,
    p1: port1,
    p2: port2,
    p3: port3,
    s1: scale1,
    s2: scale2,
  }
}
