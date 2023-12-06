import * as Tone from 'tone'
import { InstChConf } from '../types'
import { providePreset } from '../utils'

const defaultSynOptions = {
  id: 'syn',
  initialVolume: -60,
  highPassFreq: 1000,
  asdr: { attack: 0, sustain: 0.5, decay: 0.4, release: 0.3 },
}

export const defaultSyn = providePreset(
  defaultSynOptions,
  (options): InstChConf => ({
    id: options.id,
    inst: new Tone.PolySynth(Tone.AMSynth).set({
      envelope: { attack: 0, sustain: 0.5, decay: 0.4, release: 0.3 },
    }),
    effects: [
      new Tone.Filter(options.highPassFreq, 'highpass'),
      new Tone.EQ3(20, 4, 10),
      new Tone.AutoPanner('4n'),
    ],
    initialVolume: options.initialVolume,
  })
)

export const fmSynth = providePreset(
  {
    id: 'syn',
    highPassFreq: 500,
    lowPassFreq: 8000,
    initialVolume: -30,
    asdr: { attack: 0.4, sustain: 0.5, decay: 0, release: 0 },
  },
  ({ id, initialVolume, highPassFreq, lowPassFreq, asdr }): InstChConf => ({
    id,
    inst: new Tone.PolySynth(Tone.FMSynth).set({ envelope: asdr }),
    effects: [
      new Tone.Filter(highPassFreq, 'highpass'),
      new Tone.Filter(lowPassFreq, 'lowpass'),
    ],
    initialVolume,
  })
)

export const noiseSynth = providePreset(
  { id: 'noise', initialVolume: -30 },
  ({ id, initialVolume }): InstChConf => ({
    id,
    inst: new Tone.NoiseSynth(),
    initialVolume,
  })
)
