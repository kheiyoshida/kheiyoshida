import * as mgnr from 'mgnr-tone/src'
import { InstChConf } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { fireByRate } from 'utils'

export const createSynCh = () => {
  const synCh: InstChConf = {
    id: 'syn1',
    inst: new Tone.PolySynth(Tone.AMSynth).set({
      envelope: { attack: 0.2, sustain: 0.2, release: 0.3 },
    }),
    effects: [
      new Tone.Filter(1000, 'highpass'),
      new Tone.EQ3(20, 4, 10),
      new Tone.AutoPanner('4n'),
    ],
    initialVolume: -60,
    volumeRange: {
      max: -10,
      min: -60,
    },
  }
  return synCh
}

export const setupSynCh = (scale: mgnr.Scale) => {
  const mixer = mgnr.getMixer()
  const synCh = mixer.createInstChannel(createSynCh())

  const generator = mgnr.createGenerator({
    scale,
    sequence: {
      length: 10,
      division: 8,
      density: 0.3,
      fillStrategy: 'fill',
      polyphony: 'poly',
      lenRange: {
        min: 30,
        max: 50,
      },
    },
    note: {
      duration: {
        min: 4,
        max: 6,
      },
      harmonizer: {
        degree: ['3'],
        lookDown: true,
      },
    },
    middlewares: {
      changeLength: mgnr.pingpongSequenceLength('extend'),
    },
  })

  const outlet = mgnr.createOutlet(synCh)
  generator.constructNotes()
  outlet
    .assignGenerator(generator)

    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ strategy: 'randomize', rate: 0.3 })
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      generator.changeLength(4)
    })

  const generator2 = mgnr.createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.3,

      fillStrategy: 'fill',
      polyphony: 'mono',
      lenRange: {
        min: 2,
        max: 40,
      },
    },
    note: {
      duration: 1,
    },
    middlewares: {
      changeLength: mgnr.pingpongSequenceLength('extend'),
    },
  })
  generator2.constructNotes()
  const outlet2 = mgnr.createOutlet(synCh)
  outlet2.assignGenerator(generator)
  generator2.constructNotes({
    0: [
      {
        pitch: 'random',
        vel: 100,
        dur: 4,
      },
    ],
    12: [
      {
        pitch: 'random',
        vel: 100,
        dur: 4,
      },
    ],
  })

  outlet2
    .assignGenerator(generator2)
    .loopSequence(4)
    .onEnded((generator) => {
      generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      generator.changeLength(4)
    })

  mgnr.registerTimeEvents({
    repeat: [
      {
        interval: '16m',
        handler: () => {
          if (fireByRate(0.8)) {
            synCh.dynamicVolumeFade(synCh.volumeRangeDiff, '32m')
          }
          if (fireByRate(0.2)) {
            synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, '16m')
          }
        },
      },
    ],
  })
  return synCh
}
