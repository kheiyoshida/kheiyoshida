import Logger from 'js-logger'
import { Musician } from 'src/lib/music/Musician'
import * as Events from 'src/lib/music/core/events'
import * as ToneCommands from 'src/lib/music/externals/tone/commands'
import {
  MuteRequired
} from 'src/lib/music/externals/tone/events'
import { Scale } from 'src/lib/music/generator/Scale'
import { random } from 'src/lib/music/utils/calc'
import {
  createKickCh,
  createPadCh,
  createSynCh,
} from 'src/maze/service/sound/module/inst'
import { createFilteredDelaySend } from 'src/maze/service/sound/module/send'
import * as Tone from 'tone'

export const song = () => {
  Musician.init('tone', { bpm: 112 })

  // Channel Setup
  const synCh = createSynCh()
  const padCh = createPadCh()
  const kickCh = createKickCh()
  const delaySend = createFilteredDelaySend()

  ToneCommands.AssignSendChannel.pub({
    from: synCh.id,
    to: delaySend.id,
    gainAmount: 0,
  })

  ToneCommands.AssignSendChannel.pub({
    from: padCh.id,
    to: delaySend.id,
    gainAmount: 0.2,
  })

  // Sequence/Scale
  const scale = new Scale({
    key: 'D#',
    pref: 'major',
    range: {
      min: 30,
      max: 50,
    },
  })

  const scale2 = new Scale({
    key: 'D#',
    pref: 'major',
    range: {
      min: 50,
      max: 70,
    },
  })

  // ToneCommands.AssignGenerator.pub({
  //   channelId: padCh.id,
  //   loop: 4,
  //   conf: {
  //     noteDur: {
  //       min: 1,
  //       max: 2,
  //     },
  //     scale,
  //     density: 0.5,
  //     fillStrategy: 'fill',
  //     length: 2,
  //     division: 1,
  //   },
  //   events: {
  //     elapsed: {
  //       rate: 0.9,
  //       strategy: 'inPlace',
  //     },
  //     ended: (mes) => {
  //       return [
  //         Events.SequenceReAssignRequired.create({
  //           out: mes.out,
  //           loop: 2,
  //           startTime: mes.endTime,
  //           reset: true,
  //         }),
  //       ]
  //     },
  //   },
  // })

  ToneCommands.AssignGenerator.pub({
    channelId: kickCh.id,
    loop: 4,
    conf: {
      scale,
      fillStrategy: 'fixed',
    },
    notes: {
      0: [
        {
          pitch: 30,
          vel: 100,
          dur: 1,
        },
      ],
      4: [
        {
          pitch: 30,
          vel: 100,
          dur: 1,
        },
      ],
      8: [
        {
          pitch: 30,
          vel: 100,
          dur: 1,
        },
      ],
      12: [
        {
          pitch: 30,
          vel: 100,
          dur: 1,
        },
      ],
    },
  })

  // ToneCommands.AssignGenerator.pub({
  //   channelId: synCh.id,
  //   loop: 8,
  //   conf: {
  //     scale: scale2,
  //     length: 12,
  //     division: 16,
  //     density: 0.2,
  //     noteVel: {
  //       min: 80,
  //       max: 120,
  //     },
  //     fillStrategy: 'random',
  //   },
  //   events: {
  //     ended: (mes) => {
  //       const key = nthDegreeTone(scale2.key, '4')
  //       return [
  //         Events.ScaleModulationRequired.create({
  //           scale: scale2,
  //           next: {
  //             key,
  //           },
  //           stages: 10,
  //         }),
  //         Events.SequenceReAssignRequired.create({
  //           out: mes.out,
  //           loop: mes.loop,
  //           startTime: mes.endTime,
  //         }),
  //       ]
  //     },
  //   },
  // })

  ToneCommands.AssignGenerator.pub({
    channelId: synCh.id,
    loop: 1,
    conf: {
      scale: scale2,
      length: 10,
      division: 16,
      density: 0.5,
      fillStrategy: 'fill',
      fillPref: 'allowPoly',
      lenRange: {
        min: 2,
        max: 20,
      },
    },
    events: {
      ended: (mes, music) => {
        return [
          Events.SequenceLengthChangeRequired.create({
            gen: mes.out.generator,
            len: 2,
            method: 'extend',
            exceeded: 'erase',
          }),
          Events.SequenceReAssignRequired.create({
            out: mes.out,
            loop: mes.loop,
            startTime: mes.endTime,
          }),
        ]
      },
    },
  })

  ToneCommands.RegisterTimeEvents.pub({
    events: {
      once: [
        {
          time: '2:0:0',
          handler: () => {
            console.log(Tone.Transport.position)
          },
        },
        // {
        //   time: '8:0:0',
        //   handler: () => {
        //     SendFadeRequired.pub({
        //       channel: synCh.id,
        //       send: delaySend.id,
        //       values: [4, '8m'],
        //     })
        //     FadeRequired.pub({
        //       channel: synCh.id,
        //       values: [-20, '8m'],
        //     })
        //   },
        // },
        // {
        //   time: '16:0:0',
        //   handler: () => {
        //     DisposeChannelRequired.pub({
        //       channelId: delaySend.id,
        //     })
        //   },
        // },
      ],
      repeat: [
        {
          interval: '1m',
          handler: () => {
            Logger.info(Tone.Transport.position)
          },
        },
        {
          interval: '8m',
          start: '8:0:0',
          handler: () => {
            if (random(0.2)) {
              MuteRequired.pub({
                channel: kickCh.id,
                value: 'toggle',
              })
            }
            if (random(0.8)) {
              MuteRequired.pub({
                channel: kickCh.id,
                value: 'on',
              })
            }
          },
        },
      ],
    },
  })
}
