import * as E from 'mgnr/dist/core/events'
import * as TC from 'mgnr/dist/externals/tone/commands'
import { Scale } from 'mgnr/dist/generator/Scale'
import { defaultPad } from 'src/lib/sound/presets/inst/pad'

export const setupPadCh = (scale: Scale) => {
  const padCh = defaultPad({
    id: 'pad',
    asdr: { attack: 0.5, sustain: 1, decay: 0.8, release: 0 },
    highPassFreq: 300,
    lowPassFreq: 1400,
    initialVolume: -10,
  })
  TC.SetupInstChannel.pub({ conf: padCh })

  TC.AssignGenerator.pub({
    channelId: padCh.id,
    loop: 2,
    conf: {
      scale: scale,
      length: 12,
      division: 16,
      density: 0.2,
      noteDur: {
        min: 3,
        max: 8,
      },
      lenRange: {
        min: 4,
        max: 40,
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
    },
    events: {
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.3, strategy: 'randomize' })
        mes.out.generator.mutate({ rate: 0.4, strategy: 'inPlace' })
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
    channelId: padCh.id,
    loop: 3,
    conf: {
      scale: scale,
      length: 12,
      division: 16,
      density: 0.2,
      noteDur: {
        min: 3,
        max: 8,
      },
      lenRange: {
        min: 4,
        max: 20,
      },
      noteVel: {
        min: 20,
        max: 80,
      },
      fillStrategy: 'fill',
      fillPref: 'mono',
    },
    events: {
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.4, strategy: 'inPlace' })
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
          }),
        ]
      },
    },
  })

  return padCh
}
