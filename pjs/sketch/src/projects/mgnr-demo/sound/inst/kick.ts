import * as E from 'mgnr/dist/core/events'
import * as TC from 'mgnr/dist/externals/tone/commands'
import { Scale } from 'mgnr/dist/generator/Scale'
import { defaultKick, defaultTom } from 'src/lib/sound/presets/inst/kick'
import { kickFactory } from '../../../../lib/sound/presets/notes/kick'

export const setupKick = () => {
  const kickCh = defaultKick({
    id: 'kick',
    initialVolume: -20,
    lowPassFreq: 120,
  })
  TC.SetupInstChannel.pub({ conf: kickCh })

  TC.AssignGenerator.pub({
    channelId: kickCh.id,
    loop: 2,
    conf: {
      scale: new Scale({ range: { min: 30, max: 31 } }),
      length: 8,
      division: 8,
      density: 0.3,
      fillStrategy: 'fill',
      fillPref: 'mono',
      lenRange: {
        min: 4,
        max: 50,
      },
    },
    notes: {
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
    },
    events: {
      ended: (mes) => {
        mes.out.generator.mutate({ strategy: 'move', rate: 0.3 })
        return [
          E.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            method: 'extend',
            len: 3,
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
  return kickCh
}

export const setupTom = () => {
  const tomCh = defaultTom({
    id: 'tom',
    initialVolume: -30,
    lowPassFreq: 700,
    highPassFreq: 500,
  })
  TC.SetupInstChannel.pub({ conf: tomCh })

  TC.AssignGenerator.pub({
    channelId: tomCh.id,
    loop: 2,
    conf: {
      scale: new Scale({ range: { min: 20, max: 40 } }),
      length: 40,
      division: 16,
      density: 0.1,
      fillStrategy: 'fill',
      fillPref: 'mono',
    },
    notes: kickFactory(10, 8),
    events: {
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
          }),
        ]
      },
    },
  })

  return tomCh
}
