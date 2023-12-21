import { fmSynth, registerTremolo } from 'mgnr-tone-presets'
import { Scale } from 'mgnr/src/core/generator/Scale'
import * as mgnr from 'mgnr/src/mgnr-tone'

export const setupSynCh = (scale: Scale) => {
  const mixer = mgnr.getMixer()
  const synCh = mixer.createInstChannel(
    fmSynth({
      highPassFreq: 600,
      lowPassFreq: 1000,
      initialVolume: -40,
    })
  )
  const out = mgnr.createOutlet(synCh)
  const generator = mgnr.createGenerator({
    scale,
    length: 10,
    division: 8,
    density: 0.3,
    fillStrategy: 'fill',
    fillPref: 'mono',
    noteDur: {
      min: 4,
      max: 6,
    },
    lenRange: {
      min: 30,
      max: 50,
    },
    harmonizer: {
      degree: ['4'],
      lookDown: true,
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
  generator.feedOutlet(out)
  const lengthChange = mgnr.pingpongSequenceLength('extend')
  out
    .loopSequence(4)
    .onElapsed((mes) => {
      mes.out.generator.mutate({ rate: 0.3, strategy: 'randomize' })
    })
    .onEnded(({ out, repeatLoop }) => {
      out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
      out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      lengthChange(out.generator, 4)
      out.generator.resetNotes()
      repeatLoop()
    })

  registerTremolo(synCh)({ randomRate: 0.01, interval: '3hz' })

  return synCh
}

