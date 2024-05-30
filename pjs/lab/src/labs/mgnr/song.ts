import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'
import { drumMachine, compsoiteSynth } from './instruments'

const mixer = mgnr.getMixer()

export const prepareSong = () => {
  // prepareDrums()
  prepareSynth()
}

const prepareDrums = () => {
  const scale = mgnr.createScale('C', 'major', { min: 30, max: 80 })
  const synCh = mixer.createInstChannel({
    inst: drumMachine,
    initialVolume: -6,
  })

  const outlet = mgnr.createOutlet(synCh.inst, Tone.Transport.toSeconds('2n'))

  const generator = mgnr.createGenerator({
    scale: scale,
    length: 16,
    division: 16,
    density: 0.5,
    noteDur: 1,
    fillPref: 'mono',
    fillStrategy: 'fill',
  })
  const generator2 = mgnr.createGenerator({
    scale: scale,
    length: 16,
    division: 16,
    density: 0.5,
    noteDur: 1,
    fillPref: 'mono',
    fillStrategy: 'fill',
  })

  generator.constructNotes({
    0: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
    4: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
      {
        pitch: 50,
        dur: 1,
        vel: 100,
      },
    ],
    8: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
    12: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
      {
        pitch: 50,
        dur: 1,
        vel: 100,
      },
    ],
    14: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
  })

  generator2.constructNotes({
    2: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
    6: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
    10: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
    14: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
  })

  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onEnded((c) => c.repeatLoop())

  outlet
    .assignGenerator(generator2)
    .loopSequence(2)
    .onEnded((c) => {
      c.generator.mutate({ rate: 0.25, strategy: 'move' })
      c.repeatLoop()
    })
}

const prepareSynth = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 30, max: 80 })
  const compositeCh = mixer.createInstChannel({
    inst: compsoiteSynth,
    initialVolume: -20,
    effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })
  const outlet = mgnr.createOutlet(compositeCh.inst)
  const generator = mgnr.createGenerator({
    scale: scale,
    length: 10,
    division: 16,
    density: 0.7,
    noteDur: {
      min: 4,
      max: 8,
    },
    fillPref: 'mono',
  })
  generator.constructNotes()
  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((c) => {
      c.generator.mutate({ rate: 0.5, strategy: 'inPlace' })
    })
    .onEnded((c) => {
      c.generator.mutate({ rate: 0.5, strategy: 'randomize' })
      c.repeatLoop()
    })
}
