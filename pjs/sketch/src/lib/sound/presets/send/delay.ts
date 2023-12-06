import * as Tone from 'tone'
import { SendChConf } from '../types'
import { providePreset } from '../utils'

export const filterDelay = providePreset(
  {
    id: 'filterDelay',
  },
  (options): SendChConf => ({
    id: options.id,
    effects: [
      new Tone.Filter(1200, 'highpass'),
      new Tone.Filter(5000, 'lowpass'),
      new Tone.PingPongDelay({
        delayTime: '8n.',
        maxDelay: 1,
        feedback: 0.2,
      }),
      new Tone.Chorus(1000),
    ],
  })
)

export const reverb = providePreset(
  {
    id: 'reverb',
    decay: 2.4
  },
  (options): SendChConf => ({
    id: options.id,
    effects: [new Tone.Reverb({ decay: options.decay })],
  })
)
