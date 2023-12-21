import * as Tone from 'tone'
import { providePreset } from '../utils/utils'

const defaultPadOptions = {
  id: 'pad',
  highPassFreq: 200,
  lowPassFreq: 500,
  asdr: { attack: 0.4, sustain: 0.4, decay: 0.6, release: 0.9 },
  initialVolume: -15,
}

export const defaultPad = providePreset(
  defaultPadOptions,
  (options) => ({
    inst: new Tone.PolySynth(Tone.AMSynth).set({
      envelope: options.asdr,
    }),
    effects: [
      new Tone.Filter(options.highPassFreq, 'highpass'),
      new Tone.Filter(options.lowPassFreq, 'lowpass'),
      
    ],
    initialVolume: options.initialVolume,
  })
)
