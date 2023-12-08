import * as E from 'mgnr/src/core/events'
import * as TC from 'mgnr/src/externals/tone/commands'
import * as TE from 'mgnr/src/externals/tone/events'
import { ChConf, InstCh } from 'mgnr/src/externals/tone/mixer/Channel'
import { Scale } from 'mgnr/src/generator/Scale'
import * as Tone from 'tone'
import { createFilteredDelaySend } from '../mix/send'
import { fade } from '../mix/fade'
import { random } from 'mgnr/src/utils/calc'

export const createSynCh = () => {
  const synCh: ChConf<InstCh> = {
    id: 'syn1',
    inst: new Tone.PolySynth(Tone.AMSynth).set({
      envelope: { attack: 0.2, sustain: 0.2, release: 0.3 },
    }),
    effects: [
      new Tone.Filter(1000, 'highpass'),
      new Tone.EQ3(20, 4, 10),
      new Tone.AutoPanner('4n'),
    ],
    initialVolume: -60,
  }
  TC.SetupInstChannel.pub({ conf: synCh })
  return synCh
}

export const setupSynCh = (
  scale: Scale,
  delaySend: ReturnType<typeof createFilteredDelaySend>
) => {
  const synCh = createSynCh()

  TC.AssignSendChannel.pub({
    from: synCh.id,
    to: delaySend.id,
    gainAmount: 1.4,
  })

  TC.AssignGenerator.pub({
    channelId: synCh.id,
    loop: 4,
    conf: {
      scale,
      length: 10,
      division: 8,
      density: 0.3,
      fillStrategy: 'fill',
      fillPref: 'allowPoly',
      noteDur: {
        min: 4,
        max: 6,
      },
      lenRange: {
        min: 30,
        max: 50,
      },
      harmonizer: {
        degree: ['3'],
        lookDown: true
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
          }),
        ]
      },
    },
  })

  fade(
    synCh.id,
    '16mm',
    {
      rate: 0.8,
      duration: '32m',
      volume: -10,
    },
    {
      rate: 0.2,
      duration: '16m',
      volume: -60,
    }
  )
}
