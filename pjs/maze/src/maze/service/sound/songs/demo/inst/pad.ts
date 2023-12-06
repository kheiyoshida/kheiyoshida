import * as E from 'src/lib/music/core/events'
import * as TC from 'src/lib/music/externals/tone/commands'
import * as TE from 'src/lib/music/externals/tone/events'
import { ChConf, InstCh } from 'src/lib/music/externals/tone/mixer/Channel'
import { Scale } from 'src/lib/music/generator/Scale'
import * as Tone from 'tone'
import { createFilteredDelaySend } from '../mix/send'
import { fade, fadeWithoutMute } from '../mix/fade'
import { random } from 'src/lib/music/utils/calc'

export const createPadCh = () => {
  const padCh: ChConf<InstCh> = {
    id: 'pad',
    inst: new Tone.PolySynth().set({
      envelope: { attack: 0.4, sustain: 0.4, release: 0.9 },
    }),
    effects: [
      new Tone.Filter(200, 'highpass'),
      new Tone.Filter(500, 'lowpass'),
      new Tone.EQ3(-4, 0, 4),
      new Tone.Compressor({ attack: 0.4, release: 0.7, threshold: -30 }),
    ],
    initialVolume: -15,
  }
  TC.SetupInstChannel.pub({ conf: padCh })
  return padCh
}

export const setupPadCh = (
  scale: Scale,
  delaySend: ReturnType<typeof createFilteredDelaySend>
) => {
  const padCh = createPadCh()

  TC.AssignGenerator.pub({
    channelId: padCh.id,
    loop: 2,
    conf: {
      scale: scale,
      length: 12,
      division: 8,
      density: 0.4,
      noteDur: {
        min: 4,
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
      },
    },
    events: {
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.3, strategy: 'randomize' })
        mes.out.generator.mutate({ rate: 0.3, strategy: 'inPlace' })
        return [
          E.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            method: 'extend',
            len: 2,
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

  TC.AssignSendChannel.pub({
    from: padCh.id,
    to: delaySend.id,
    gainAmount: 2,
  })

  // fadeWithoutMute(
  //   padCh.id,
  //   '16m',
  //   {
  //     rate: 1,
  //     duration: '32m',
  //     volume: 0,
  //   },
  //   {
  //     rate: 0.2,
  //     duration: '32m',
  //     volume: -60,
  //   }
  // )

  TC.RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          interval: '72hz',
          handler: () => {
            if (random(0.3)) return
            TE.MuteRequired.pub({
              channel: padCh.id,
              value: 'toggle',
            })
          },
        },
      ],
    },
  })
}
