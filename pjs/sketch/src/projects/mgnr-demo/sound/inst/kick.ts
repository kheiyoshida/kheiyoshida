import * as mgnr from 'mgnr/src/mgnr-tone'
import { defaultKick } from 'mgnr-tone-presets'

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
