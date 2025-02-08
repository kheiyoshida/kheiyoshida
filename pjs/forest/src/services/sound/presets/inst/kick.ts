import * as Tone from 'tone'
import { providePreset } from '../utils'

const defaultKickOptions = {
  id: 'kick',
  highPassFreq: 100,
  lowPassFreq: 200,
  initialVolume: -80,
  volumeRange: {
    min: -40,
    max: -16
  }
}

export const defaultKick = providePreset(
  defaultKickOptions,
  (options) => ({
    inst: new Tone.PolySynth(Tone.MembraneSynth),
    effects: [
      new Tone.Filter({ frequency: options.highPassFreq, type: 'highpass' }),
      new Tone.Filter({ frequency: options.lowPassFreq, type: 'lowpass' }),
      new Tone.Compressor(-10, 1.5).set({ attack: 0.2, release: 0.5 }),
    ],
    initialVolume: options.initialVolume,
    volumeRange: options.volumeRange
  })
)

export const defaultTom = providePreset(
  {
    highPassFreq: 100,
    lowPassFreq: 200,
    initialVolume: -20,
    volumeRange: {
      min: -30,
      max: -16,
    },
  },
  (options) => ({
    inst: new Tone.PolySynth(Tone.MembraneSynth).set({
      envelope: { attack: 0, sustain: 0.2, decay: 0.1, release: 0 },
    }),
    effects: [
      new Tone.Filter({ frequency: options.highPassFreq, type: 'highpass' }),
      new Tone.Filter({ frequency: options.lowPassFreq, type: 'lowpass' }),
      new Tone.Compressor(-4, 1.5).set({ attack: 0.5, release: 0.1 }),
    ],
    initialVolume: options.initialVolume,
    volumeRange: options.volumeRange
  })
)
