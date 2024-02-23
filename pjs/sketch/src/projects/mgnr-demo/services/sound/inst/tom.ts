import * as mgnr from 'mgnr-tone/src'
import { defaultTom, kickFactory } from 'mgnr-tone-presets'
import { randomFloatBetween } from 'utils'

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
  const generator = mgnr.createGenerator({
    scale: mgnr.createScale({ range: { min: 20, max: 40 } }),
    length: 20,
    division: 16,
    density: 0.1,
    lenRange: {
      min: 10,
      max: 40
    },
    fillStrategy: 'fill',
    fillPref: 'mono',
  })
  generator.constructNotes(kickFactory(10, 8))
  generator.feedOutlet(tomOut)
  const changeLength = mgnr.pingpongSequenceLength('extend')
  tomOut.loopSequence(2).onEnded(({ out, endTime }) => {
    out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
    out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
    changeLength(out.generator, 4)
    tomOut.loopSequence(2, endTime)
  })

  const randomizeConfig = () => {
    generator.updateConfig({
      density: randomFloatBetween(0.1, 0.3),      
    })
  }

  return {tomCh, randomizeConfig}
}
