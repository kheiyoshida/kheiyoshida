import * as E from 'mgnr/dist/core/events'
import * as TC from 'mgnr/dist/externals/tone/commands'
import { Scale } from 'mgnr/dist/generator/Scale'
import { fmSynth } from 'src/lib/sound/presets/inst/syn'
import { registerTremolo } from 'src/lib/sound/presets/mix/tremolo'

export const setupSynCh = (scale: Scale) => {
  const synCh = fmSynth({
    highPassFreq: 600,
    lowPassFreq: 1000,
    initialVolume: -40,
  })
  TC.SetupInstChannel.pub({ conf: synCh })

  TC.AssignGenerator.pub({
    channelId: synCh.id,
    loop: 4,
    conf: {
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
    },
    events: {
      elapsed: {
        strategy: 'randomize',
        rate: 0.3,
      },
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
        mes.out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
        return [
          E.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            method: 'extend',
            len: 4,
            exceeded: 'reverse',
          }),
          E.SequenceReAssignRequired.create({
            out: mes.out,
            startTime: mes.endTime,
            reset: true,
          }),
        ]
      },
    },
  })

  TC.AssignGenerator.pub({
    channelId: synCh.id,
    loop: 4,
    conf: {
      scale,
      length: 16,
      division: 16,
      density: 0.3,
      fillStrategy: 'fill',
      fillPref: 'mono',
      noteDur: 1,
      lenRange: {
        min: 2,
        max: 40,
      },
    },
    notes: {
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
    },
    events: {
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
        return [
          E.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            method: 'extend',
            len: 4,
            exceeded: 'reverse',
          }),
          E.SequenceReAssignRequired.create({
            out: mes.out,
            startTime: mes.endTime,
            reset: true,
          }),
        ]
      },
    },
  })

  registerTremolo(synCh.id)({ randomRate: 0.01, interval: '3hz' })

  return synCh
}

export const setupExtraSynCh = (scale: Scale) => {
  const exSynCh = fmSynth({
    id: 'exSyn',
    highPassFreq: 700,
    lowPassFreq: 6000,
    initialVolume: -52,
    asdr: { attack: 0, sustain: 0.5, decay: 0, release: 0 },
  })

  TC.SetupInstChannel.pub({ conf: exSynCh })

  TC.AssignGenerator.pub({
    channelId: exSynCh.id,
    loop: 4,
    conf: {
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
    },
    events: {
      elapsed: {
        strategy: 'randomize',
        rate: 0.3,
      },
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
        return [
          E.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            method: 'extend',
            len: 4,
            exceeded: 'reverse',
          }),
          E.SequenceReAssignRequired.create({
            out: mes.out,
            startTime: mes.endTime,
          }),
        ]
      },
    },
  })

  TC.AssignGenerator.pub({
    channelId: exSynCh.id,
    loop: 4,
    conf: {
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
    },
    notes: {
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
    },
    events: {
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.2, strategy: 'inPlace' })
        return [
          E.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            method: 'extend',
            len: 6,
            exceeded: 'reverse',
          }),
          E.SequenceReAssignRequired.create({
            out: mes.out,
            startTime: mes.endTime,
          }),
        ]
      },
    },
  })

  return exSynCh
}
