import * as mgnr from 'mgnr-tone'
import { Scale } from 'mgnr-tone'
import { fmSynth } from 'mgnr-tone-presets'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'

export const setupExtraSynCh = (scale: Scale) => {
  const mixer = mgnr.getMixer()
  const exSynCh = mixer.createInstChannel(
    fmSynth({
      highPassFreq: 700,
      lowPassFreq: 6000,
      asdr: { attack: 1, sustain: 0.5, decay: 0, release: 0 },
      initialVolume: -30,
      volumeRange: {
        min: -40,
        max: -16,
      },
    })
  )
  exSynCh.mute('on')

  const out = mgnr.createOutlet(exSynCh)

  const generator = mgnr.createGenerator({
    scale,
    sequence: {
      length: 10,
      division: 16,
      density: 0.3,
      fillStrategy: 'fill',
      polyphony: 'mono',
      lenRange: {
        min: 12,
        max: 30,
      },
    },
    note: {
      duration: {
        min: 1,
        max: 3,
      },
    },
    middlewares: {
      lengthChange: mgnr.pingpongSequenceLength('extend'),
    },
  })

  generator.constructNotes()

  out
    .assignGenerator(generator)
    .loopSequence(2)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.3, strategy: 'randomize' })
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      generator.lengthChange(4)
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
        min: 10,
        max: 40,
      },
    },
    note: {
      duration: {
        min: 2,
        max: 3,
      },
    },
    middlewares: {
      lengthChange: mgnr.pingpongSequenceLength('extend'),
    },
  })

  generator2.constructNotes({
    0: [
      {
        pitch: 'random',
        vel: 100,
        dur: 4,
      },
    ],
    3: [
      {
        pitch: 'random',
        vel: 100,
        dur: 4,
      },
    ],
  })

  out
    .assignGenerator(generator2)
    .loopSequence(2)
    .onEnded((generator) => {
      generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      generator.lengthChange(6)
    })

  const randomizeConfig = () => {
    generator.updateConfig({
      sequence: {
        density: randomFloatBetween(0.3, 0.7),
      },
      note: {
        duration: {
          min: randomIntInclusiveBetween(1, 2),
          max: randomIntInclusiveBetween(2, 5),
        },
      },
    })
    generator2.updateConfig({
      sequence: {
        density: randomFloatBetween(0.3, 0.7),
      },
      note: {
        duration: {
          min: randomIntInclusiveBetween(2, 3),
          max: randomIntInclusiveBetween(3, 5),
        },
      },
    })
  }

  return { exSynCh, randomizeConfig }
}
