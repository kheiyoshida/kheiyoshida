import * as Tone from 'tone'
import { InstChConf } from '../types'
import { providePreset } from '../utils'

const defaultPadOptions = {
  id: 'pad',
  highPassFreq: 200,
  lowPassFreq: 500,
  asdr: { attack: 0.4, sustain: 0.4, decay: 0.6, release: 0.9 },
  initialVolume: -15
}

export const defaultPad = providePreset(
  defaultPadOptions,
  (options): InstChConf => ({
    inst: new Tone.PolySynth(Tone.AMSynth).set({
      envelope: options.asdr,
    }),
    effects: [
      new Tone.Filter(options.highPassFreq, 'highpass'),
      new Tone.Filter(options.lowPassFreq, 'lowpass'),
      // new Tone.EQ3(-4, 0, 4),
      // new Tone.Compressor({ attack: 0.4, release: 0.7, threshold: -10 }),
    ],
    initialVolume: options.initialVolume,
  })
)
