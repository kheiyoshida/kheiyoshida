import * as mgnr from 'mgnr/src/mgnr-tone'
import { defaultKick, defaultTom } from 'src/lib/sound/presets/inst/kick'
import { kickFactory } from '../../../../lib/sound/presets/notes/kick'

export const setupKick = () => {
  const mixer = mgnr.getMixer()
  const kickCh = mixer.createInstChannel(
    defaultKick({
      initialVolume: -20,
      lowPassFreq: 120,
    })
  )
  const kickOut = mgnr.createOutlet(kickCh)

  const generator = mgnr.createGenerator({
    scale: mgnr.createScale({ range: { min: 30, max: 31 } }),
    length: 8,
    division: 8,
    density: 0.3,
    fillStrategy: 'fill',
    fillPref: 'mono',
    lenRange: {
      min: 4,
      max: 50,
    },
  })

  generator.feedOutlet(kickOut)
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

  const changeLength = mgnr.pingpongSequenceLength('extend')
  kickOut.loopSequence(2).onEnded(({ out, endTime }) => {
    out.generator.mutate({ strategy: 'move', rate: 0.3 })
    changeLength(out.generator, 3)
    kickOut.loopSequence(2, endTime)
  })
  return kickCh
}

export const setupTom = () => {
  const mixer = mgnr.getMixer()
  const tomCh = mixer.createInstChannel(
    defaultTom({
      initialVolume: -30,
      lowPassFreq: 700,
      highPassFreq: 500,
    })
  )
  const tomOut = mgnr.createOutlet(tomCh)
  const generator = mgnr.createGenerator({
    scale: mgnr.createScale({ range: { min: 20, max: 40 } }),
    length: 40,
    division: 16,
    density: 0.1,
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
  return tomCh
}
