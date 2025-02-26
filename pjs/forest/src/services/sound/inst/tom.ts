import { defaultTom, kickFactory } from '../presets'
import * as mgnr from 'mgnr-tone/src'
import { randomFloatBetween } from 'utils'
import { ForestSequenceGenerator } from '../generator.ts'

export const setupTom = () => {
  const mixer = mgnr.getMixer()
  const tomCh = mixer.createInstChannel(
    defaultTom({
      initialVolume: -30,
      lowPassFreq: 700,
      highPassFreq: 500,
      volumeRange: {
        min: -30,
        max: -6,
      },
    })
  )
  tomCh.mute('on')
  const tomOut = mgnr.createOutlet(tomCh)
  const generator = ForestSequenceGenerator.create({
    scale: mgnr.createScale({ range: { min: 20, max: 40 } }),
    sequence: {
      length: 20,
      division: 16,
      density: 0.1,
      lenRange: {
        min: 10,
        max: 40,
      },
      fillStrategy: 'fill',
      polyphony: 'mono',
    },
  })
  generator.constructNotes(kickFactory(10, 8))

  tomOut
    .assignGenerator(generator)
    .loopSequence(2)
    .onEnded((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'randomize' })
      generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      ;(generator as ForestSequenceGenerator).changeLength(4)
    })

  const randomizeConfig = () => {
    generator.updateConfig({
      sequence: {
        density: randomFloatBetween(0.1, 0.3),
      },
    })
  }

  return { tomCh, randomizeConfig }
}
