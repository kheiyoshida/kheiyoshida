import * as Tone from 'tone'
import { providePreset } from '../utils/utils'

const defaultSynOptions = {
  id: 'syn',
  initialVolume: -60,
  highPassFreq: 1000,
  asdr: { attack: 0, sustain: 0.5, decay: 0.4, release: 0.3 },
}

export const defaultSyn = providePreset(
  defaultSynOptions,
  (options) => ({
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
    highPassFreq: 500,
    lowPassFreq: 8000,
    initialVolume: -30,
    asdr: { attack: 0.4, sustain: 0.5, decay: 0, release: 0 },
  },
  ({ initialVolume, highPassFreq, lowPassFreq, asdr }) => ({
    inst: new Tone.PolySynth(Tone.FMSynth).set({ envelope: asdr }),
    effects: [
      new Tone.Filter(highPassFreq, 'highpass'),
      new Tone.Filter(lowPassFreq, 'lowpass'),
    ],
    initialVolume,
  })
)
