import * as E from 'mgnr/src/core/events'
import * as TC from 'mgnr/src/externals/tone/commands'
import { ChConf, InstCh } from 'mgnr/src/externals/tone/mixer/Channel'
import { Scale } from 'mgnr/src/generator/Scale'
import { kickFactory } from 'src/maze/service/sound/notes/kick'
import * as Tone from 'tone'
import { fade } from '../mix/fade'
import { createFilteredDelaySend } from '../mix/send'

const createKickCh = () => {
  const kickCh: ChConf<InstCh> = {
    id: 'kick',
    inst: new Tone.MembraneSynth(),
    effects: [
      new Tone.Filter({ frequency: 100, type: 'highpass' }),
      new Tone.Filter({ frequency: 200, type: 'lowpass' }),
      new Tone.Compressor(-10, 1.5).set({attack: 0.8, release: 0.1})
    ],
    initialVolume: -80,
  }
  TC.SetupInstChannel.pub({ conf: kickCh })
  return kickCh
}

export const setupKick = (
  delaySend: ReturnType<typeof createFilteredDelaySend>
) => {
  const kickCh = createKickCh()

  TC.AssignGenerator.pub({
    channelId: kickCh.id,
    loop: 2,
    conf: {
      scale: new Scale({ range: { min: 30, max: 31 } }),
      length: 32,
      division: 8,
      density: 0.55,
      fillStrategy: 'fill',
      fillPref: 'mono',
    },
    notes: kickFactory(32, 8),
    events: {
      ended: (mes) => [
        E.SequenceReAssignRequired.create({
          out: mes.out,
          startTime: mes.endTime,
          reset: true,
        }),
      ],
    },
  })

  fade(
    kickCh.id,
    '32m',
    {
      rate: 0.3,
      duration: '16m',
      volume: -16,
    },
    {
      rate: 0.3,
      duration: '8m',
      volume: -40,
    },
  )
}
