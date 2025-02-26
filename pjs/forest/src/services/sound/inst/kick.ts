import { defaultKick } from '../presets'
import * as mgnr from 'mgnr-tone/src'
import { randomFloatBetween } from 'utils'
import { ForestSequenceGenerator } from '../generator.ts'

export const setupKick = () => {
  const mixer = mgnr.getMixer()
  const kickCh = mixer.createInstChannel(
    defaultKick({
      initialVolume: -20,
      lowPassFreq: 120,
      volumeRange: {
        min: -40,
        max: -6,
      },
    })
  )
  const kickOut = mgnr.createOutlet(kickCh)

  const generator = ForestSequenceGenerator.create({
    scale: mgnr.createScale({ range: { min: 30, max: 31 } }),
    sequence: {
      length: 8,
      division: 8,
      density: 0.3,
      fillStrategy: 'fill',
      polyphony: 'mono',
      lenRange: {
        min: 4,
        max: 50,
      },
    },
  })

  generator.constructNotes({
    0: [
      {
        vel: 100,
        dur: 2,
        pitch: 30,
      },
    ],
    1: [
      {
        vel: 100,
        dur: 2,
        pitch: 30,
      },
    ],
  })

  kickOut
    .assignGenerator(generator)
    .loopSequence(2)
    .onEnded((generator) => {
      generator.mutate({ strategy: 'move', rate: 0.3 })
      ;(generator as ForestSequenceGenerator).changeLength(3)
    })

  const randomizeConfig = () => {
    generator.updateConfig({
      sequence: {
        density: randomFloatBetween(0.3, 0.5),
      },
    })
  }

  return { kickCh, randomizeConfig }
}
