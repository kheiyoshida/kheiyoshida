import * as mgnr from 'mgnr-tone'
import { Scale } from 'mgnr-tone'
import { fmSynth, registerTremolo } from '../presets'
import { ForestSequenceGenerator } from '../generator.ts'

export const setupSynCh = (scale: Scale) => {
  const mixer = mgnr.getMixer()
  const synCh = mixer.createInstChannel(
    fmSynth({
      highPassFreq: 600,
      lowPassFreq: 1000,
      initialVolume: -30,
    })
  )
  const out = mgnr.createOutlet(synCh)
  const generator = ForestSequenceGenerator.create({
    scale,
    sequence: {
      length: 10,
      division: 8,
      density: 0.3,
      fillStrategy: 'fill',
      polyphony: 'mono',
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
        degree: ['4'],
        lookDown: true,
      },
    },
  })

  generator.constructNotes({
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
  
  
  out.assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.3, strategy: 'randomize' })
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'randomize' })
      generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      ;(generator as ForestSequenceGenerator).changeLength(4)
      generator.resetNotes()
    })

  registerTremolo(synCh)({ randomRate: 0.01, interval: '3hz' })

  return synCh
}
