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
    note: {
      noteDur: 1,
      fillStrategy: 'fill',
    },
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      fillPref: 'mono',
    },
  })
  const generator2 = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      fillPref: 'mono',
    },
    note: {
      noteDur: 1,
      fillStrategy: 'fill',
    },
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

  const port = outlet
    .assignGenerator(generator2)
    .loopSequence(2)
    .onEnded((generator) => {
      generator.mutate({ rate: 0.25, strategy: 'move' })
    })
}

const prepareSynth = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 50, max: 80 })
  const compositeCh = mixer.createInstChannel({
    inst: compsoiteSynth,
    initialVolume: -20,
    effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })
  const outlet = mgnr.createOutlet(compositeCh.inst)
  const generator = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 10,
      density: 0.7,
      division: 16,
      fillPref: 'mono',
    },
    note: {
      noteDur: {
        min: 4,
        max: 8,
      },
      harmonizer: {
        degree: ['3', '5', '7'],
        force: false,
        lookDown: false,
      },
      fillStrategy: 'fill',
    },
    middlewares: {
      custom: (ctx) => {
        console.log('this is custome middleware: ', ctx.scale.key)
      },
    },
  })
  generator.constructNotes()
  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'inPlace' })
    })
    .onEnded((generator) => {
      generator.custom()
      generator.mutate({ rate: 0.5, strategy: 'randomize' })
    })
}
