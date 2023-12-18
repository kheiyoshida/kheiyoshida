import { ToneMusicGenerator } from 'mgnr/src/externals/tone/MusicGenerator'
import { Scale } from 'mgnr/src/generator/Scale'
import { nthDegreeTone } from 'mgnr/src/generator/utils'
import { PolySynth } from 'tone'
import { filterDelay } from '../../lib/sound/presets/send/delay'

export function test2() {
  const mgnr = new ToneMusicGenerator()

  const channelId = 'synth'
  mgnr.setupInstChannel({
    id: channelId,
    inst: new PolySynth(),
  })
  const delaySend = filterDelay()
  mgnr.setupSendChannel(delaySend)
  mgnr.assignSendChannel(channelId, delaySend.id, 1)

  const key = 'C'
  const scale = new Scale({ key, range: { min: 30, max: 70 } })
  const notes = {
    0: [
      {
        vel: 100,
        dur: 1,
        pitch: 60,
      },
    ],
    4: [
      {
        vel: 100,
        dur: 1,
        pitch: 62,
      },
    ],
    8: [
      {
        vel: 100,
        dur: 1,
        pitch: 65,
      },
    ],
    12: [
      {
        vel: 100,
        dur: 1,
        pitch: 67,
      },
    ],
  }
  mgnr.assignGenerator({
    channelId: 'synth',
    loop: 10,
    conf: {
      fillPref: 'mono',
      fillStrategy: 'fixed',
      scale,
      harmonizer: {
        degree: ['5']
      }
    },
    notes,
    events: {
      // elapsed: (mes) => {
      //   console.log(mes)
      //   return []
      // },
      ended: (mes) => {
        mes.out.generator.mutate({ rate: 0.5, strategy: 'move' })
        mgnr.reassignSequence(mes.out, mes.endTime, mes.loop)
        return null
      },
    },
  })

  mgnr.registerTimeEvents({
    once: [
      {
        time: '+1m',
        handler: () => {
          mgnr.muteChannel(channelId, 'toggle')
        },
      },
      {
        time: '+2m',
        handler: () => {
          mgnr.muteChannel(channelId, 'toggle')
        },
      },
      {
        time: '+2m',
        handler: () => {
          mgnr.fadeChannel(channelId, [-20, '4m'])
        },
      },
      {
        time: '+4m',
        handler: () => {
          mgnr.sendMute(channelId, delaySend.id, 'toggle')
        },
      },
      {
        time: '+5m',
        handler: () => {
          mgnr.sendMute(channelId, delaySend.id, 'toggle')
        },
      },
      {
        time: '+6m',
        handler: () => {
          mgnr.sendFade(channelId, delaySend.id, [2, '4m'])
        },
      },
    ],
    repeat: [
      {
        interval: '4m',
        handler: () => {
          const key = nthDegreeTone(scale.key, '6')
          mgnr.modulateScale(
            scale,
            {
              key,
            },
            3
          )
        },
      },
    ],
  })
}
