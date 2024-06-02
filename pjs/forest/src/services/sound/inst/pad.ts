import { Scale } from 'mgnr-core/src/generator/scale/Scale'
import * as mgnr from 'mgnr-tone/src'
import { defaultPad } from 'mgnr-tone-presets'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'

export const setupPadCh = (scale: Scale) => {
  const mixer = mgnr.getMixer()
  const padCh = mixer.createInstChannel(
    defaultPad({
      asdr: { attack: 0.7, sustain: 1, decay: 0.8, release: 0.2 },
      highPassFreq: 300,
      lowPassFreq: 1200,
      initialVolume: -10,
      volumeRange: {
        min: -40,
        max: -6,
      },
    })
  )
  padCh.mute('on')

  const out = mgnr.createOutlet(padCh)

  const generator = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 50,
      division: 16,
      density: 0.2,
      lenRange: {
        min: 40,
        max: 60,
      },
      fillStrategy: 'fill',
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 3,
        max: 8,
      },
      velocity: {
        min: 80,
        max: 120,
      },
      harmonizer: {
        degree: ['6'],
        lookDown: false,
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
    .onEnded((generator) => {
      generator.mutate({ rate: 0.3, strategy: 'randomize' })
      generator.mutate({ rate: 0.4, strategy: 'inPlace' })
      generator.lengthChange(4)
    })

  const randomizeConfig = () => {
    generator.updateConfig({
      note: {
        duration: {
          min: randomIntInclusiveBetween(3, 5),
          max: randomIntInclusiveBetween(6, 10),
        },
      },
      sequence: {
        density: randomFloatBetween(0.2, 0.4),
      },
    })
  }

  return { padCh, randomizeConfig }
}
