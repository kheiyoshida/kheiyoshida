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
    length: 50,
    division: 16,
    density: 0.2,
    noteDur: {
      min: 3,
      max: 8,
    },
    lenRange: {
      min: 40,
      max: 60,
    },
    noteVel: {
      min: 80,
      max: 120,
    },
    fillStrategy: 'fill',
    fillPref: 'mono',
    harmonizer: {
      degree: ['6'],
      lookDown: false,
    },
  })

  const lengthChange = mgnr.pingpongSequenceLength('extend')
  generator.constructNotes()
  generator.feedOutlet(out)
  out.loopSequence(2).onEnded((mes) => {
    mes.out.generator.mutate({ rate: 0.3, strategy: 'randomize' })
    mes.out.generator.mutate({ rate: 0.4, strategy: 'inPlace' })
    lengthChange(mes.out.generator, 4)
    out.loopSequence(2, mes.endTime)
  })

  const randomizeConfig = () => {
    generator.updateConfig({
      noteDur: {
        min: randomIntInclusiveBetween(3, 5),
        max: randomIntInclusiveBetween(6, 10),
      },
      density: randomFloatBetween(0.2, 0.4),
    })
  }

  return { padCh, randomizeConfig }
}
