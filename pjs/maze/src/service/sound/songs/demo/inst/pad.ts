import * as mgnr from 'mgnr-tone/src'
import { InstChConf } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { fireByRate } from 'utils'

export const createPadCh = () => {
  const padCh: InstChConf = {
    id: 'pad',
    inst: new Tone.PolySynth().set({
      envelope: { attack: 0.4, sustain: 0.4, release: 0.9 },
    }),
    effects: [
      new Tone.Filter(200, 'highpass'),
      new Tone.Filter(500, 'lowpass'),
      new Tone.EQ3(-4, 0, 4),
      new Tone.Compressor({ attack: 0.4, release: 0.7, threshold: -30 }),
    ],
    initialVolume: -15,
  }
  return padCh
}

export const setupPadCh = (scale: mgnr.Scale) => {
  const mixer = mgnr.getMixer()
  const padCh = mixer.createInstChannel(createPadCh())
  const outlet = mgnr.createOutlet(padCh)
  const generator = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 12,
      division: 8,
      density: 0.4,
      lenRange: {
        min: 4,
        max: 40,
      },
      fillStrategy: 'fill',
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 4,
        max: 8,
      },
      velocity: {
        min: 80,
        max: 120,
      },
      harmonizer: {
        degree: ['6'],
      },
    },
    middlewares: {
      changeLength: mgnr.pingpongSequenceLength('extend'),
    },
  })
  generator.constructNotes()

  outlet
    .assignGenerator(generator)
    .loopSequence(2)
    .onEnded((generator) => {
      generator.mutate({ rate: 0.3, strategy: 'randomize' })
      generator.mutate({ rate: 0.3, strategy: 'inPlace' })
      generator.changeLength(2)
    })

  mgnr.registerTimeEvents({
    repeat: [
      {
        interval: '72hz',
        handler: () => {
          if (fireByRate(0.3)) return
          padCh.mute('toggle')
        },
      },
    ],
  })
  return padCh
}
