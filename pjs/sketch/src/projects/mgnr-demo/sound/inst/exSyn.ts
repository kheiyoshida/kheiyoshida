import { fmSynth } from 'mgnr-tone-presets'
import { Scale } from 'mgnr/src/core/generator/Scale'
import * as mgnr from 'mgnr/src/mgnr-tone'

export const setupExtraSynCh = (scale: Scale) => {
  const mixer = mgnr.getMixer()
  const exSynCh = mixer.createInstChannel(
    fmSynth({
      highPassFreq: 700,
      lowPassFreq: 6000,
      asdr: { attack: 0, sustain: 0.5, decay: 0, release: 0 },
      initialVolume: -52,
      volumeRange: {
        min: -52,
        max: -20
      }
    })
  )

  const out = mgnr.createOutlet(exSynCh)

  const generator = mgnr.createGenerator({
    scale,
    length: 10,
    division: 16,
    density: 0.3,
    fillStrategy: 'fill',
    fillPref: 'mono',
    noteDur: {
      min: 1,
      max: 3,
    },
    lenRange: {
      min: 8,
      max: 30,
    },
  })

  generator.constructNotes()
  generator.feedOutlet(out)
  const lengthChange = mgnr.pingpongSequenceLength('extend')
  out
    .loopSequence(4)
    .onElapsed(() => {
      generator.mutate({ rate: 0.3, strategy: 'randomize' })
    })
    .onEnded((mes) => {
      mes.out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      lengthChange(mes.out.generator, 4)
      out.loopSequence(4, mes.endTime)
    })

  const generator2 = mgnr.createGenerator({
    scale,
    length: 16,
    division: 16,
    density: 0.3,
    fillStrategy: 'fill',
    fillPref: 'mono',
    noteDur: {
      min: 2,
      max: 3,
    },
    lenRange: {
      min: 2,
      max: 40,
    },
  })
  generator2.feedOutlet(out)
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
  const lengthChange2 = mgnr.pingpongSequenceLength('extend')
  out.loopSequence(4).onEnded((mes) => {
    mes.out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
    lengthChange2(mes.out.generator, 6)
    mes.out.loopSequence(4, mes.endTime)
  })
  return exSynCh
}
