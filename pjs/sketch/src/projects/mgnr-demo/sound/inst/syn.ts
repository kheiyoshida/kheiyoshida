import { Scale } from 'mgnr/src/core/generator/Scale'
import * as mgnr from 'mgnr/src/mgnr-tone'
import { fmSynth } from 'src/lib/sound/presets/inst/syn'
import { registerTremolo } from 'src/lib/sound/presets/mix/tremolo'

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
    .onEnded(({ out, endTime }) => {
      out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
      out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
      lengthChange(out.generator, 4)
      out.generator.resetNotes()
      out.loopSequence(4, endTime)
    })

  registerTremolo(synCh)({ randomRate: 0.01, interval: '3hz' })

  return synCh
}

export const setupExtraSynCh = (scale: Scale) => {
  const mixer = mgnr.getMixer()
  const exSynCh = mixer.createInstChannel(
    fmSynth({
      id: 'exSyn',
      highPassFreq: 700,
      lowPassFreq: 6000,
      initialVolume: -52,
      asdr: { attack: 0, sustain: 0.5, decay: 0, release: 0 },
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
