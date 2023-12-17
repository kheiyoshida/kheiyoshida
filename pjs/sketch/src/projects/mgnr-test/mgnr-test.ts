import { Musician } from 'mgnr/src/Musician'
import { MessageBus } from 'mgnr/src/core/MessageBus'
import * as EVENTS from 'mgnr/src/core/events'
import { ToneDestination } from 'mgnr/src/externals/tone/Destination'
import * as TONE_COMMANDS from 'mgnr/src/externals/tone/commands'
import * as TONE_EVENTS from 'mgnr/src/externals/tone/events'
import { Scale } from 'mgnr/src/generator/Scale'
import { nthDegreeTone } from 'mgnr/src/generator/utils'
import { MonoSynth, Oscillator, PolySynth } from 'tone'
import { filterDelay } from '../../lib/sound/presets/send/delay'
import { assert, beepAlert } from './assert'

export function testWrap(testFunction: () => void) {
  try {
    testFunction()
  } catch (e) {
    beepAlert()
  }
}

export function test1() {
  // bind handlers
  Musician.init()

  // assert against dest obj
  const destination = MessageBus.get().destination as ToneDestination
  const mixer = destination.mixer
  const timeObserver = destination.timeObserver
  const outs = destination.output.outs

  // setup generator, inst, and channel
  const inst = new PolySynth(MonoSynth, {volume: -30})
  const channelId = 'instCh'
  TONE_COMMANDS.SetupInstChannel.pub({
    conf: {
      id: channelId,
      inst,
    },
  })
  assert(Object.keys(mixer.channels.inst).includes(channelId), 'channel not set')

  const delaySend = filterDelay()
  TONE_COMMANDS.SetupSendChannel.pub({
    conf: delaySend,
  })
  TONE_COMMANDS.AssignSendChannel.pub({
    from: channelId,
    to: delaySend.id,
    gainAmount: 1,
  })
  assert(Object.keys(mixer.channels.sends).includes(delaySend.id))

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
  TONE_COMMANDS.AssignGenerator.pub({
    channelId,
    loop: 4,
    conf: {
      scale,
      length: 16,
      division: 16,
      fillStrategy: 'fixed',
    },
    notes,
    events: {
      elapsed: () => {
        assert(true)
        return []
      },
      ended: (mes) => {
        assert(true)
        mes.out.generator.mutate({ rate: 0.5, strategy: 'move' })
        return [
          EVENTS.SequenceReAssignRequired.create({
            out: mes.out,
            startTime: mes.endTime,
          }),
        ]
      },
    },
  })
  assert(Boolean(outs[channelId]), 'generator set')
  assert(outs[channelId].generator.sequence.notes[0][0].pitch === 60, 'note set')

  // schedule events
  TONE_COMMANDS.RegisterTimeEvents.pub({
    events: {
      once: [
        {
          time: '+1m',
          handler: () => {
            TONE_EVENTS.MuteRequired.pub({
              channel: channelId,
              value: 'toggle',
            })
          },
        },
        {
          time: '+2m',
          handler: () => {
            TONE_EVENTS.MuteRequired.pub({
              channel: channelId,
              value: 'toggle',
            })
          },
        },
        {
          time: '+2m',
          handler: () => {
            TONE_EVENTS.FadeRequired.pub({
              channel: channelId,
              values: [-20, '4m'],
            })
          },
        },
        {
          time: '+4m',
          handler: () => {
            TONE_EVENTS.SendMuteRequired.pub({
              channel: channelId,
              send: delaySend.id,
              value: 'toggle',
            })
          },
        },
        {
          time: '+5m',
          handler: () => {
            TONE_EVENTS.SendMuteRequired.pub({
              channel: channelId,
              send: delaySend.id,
              value: 'toggle',
            })
          },
        },
        {
          time: '+6m',
          handler: () => {
            TONE_EVENTS.SendFadeRequired.pub({
              channel: channelId,
              send: delaySend.id,
              values: [2, '4m'],
            })
          },
        },
      ],
      repeat: [
        {
          interval: '4m',
          handler: () => {
            const key = nthDegreeTone(scale.key, '6')
            EVENTS.ScaleModulationRequired.pub({
              scale,
              next: {
                key,
              },
              stages: 3,
            })
          },
        },
      ],
    },
  })
}

export function test2() {}
