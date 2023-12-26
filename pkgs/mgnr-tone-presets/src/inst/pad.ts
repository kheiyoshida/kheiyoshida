import * as Tone from 'tone'
import { providePreset } from '../utils/utils'

const defaultPadOptions = {
  highPassFreq: 200,
  lowPassFreq: 500,
  asdr: { attack: 0.4, sustain: 0.4, decay: 0.6, release: 0.9 },
  initialVolume: -15,
  volumeRange: {
    min: -52,
    max: -16,
  },
}

export const defaultPad = providePreset(
  defaultPadOptions,
  ({ asdr, highPassFreq, lowPassFreq, initialVolume, volumeRange }) => ({
    inst: new Tone.PolySynth(Tone.AMSynth).set({
      envelope: asdr,
    }),
    effects: [new Tone.Filter(highPassFreq, 'highpass'), new Tone.Filter(lowPassFreq, 'lowpass')],
    initialVolume,
    volumeRange,
  })
)
