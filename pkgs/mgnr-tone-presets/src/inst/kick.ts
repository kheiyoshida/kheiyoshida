import * as Tone from 'tone'
import { InstChConf } from 'mgnr/src/mgnr-tone/mixer/Channel'
import { providePreset } from '../utils/utils'

const defaultKickOptions = {
  id: 'kick',
  highPassFreq: 100,
  lowPassFreq: 200,
  initialVolume: -80,
}

export const defaultKick = providePreset(
  defaultKickOptions,
  (options): InstChConf => ({
    inst: new Tone.PolySynth(Tone.MembraneSynth),
    effects: [
      new Tone.Filter({ frequency: options.highPassFreq, type: 'highpass' }),
      new Tone.Filter({ frequency: options.lowPassFreq, type: 'lowpass' }),
      new Tone.Compressor(-10, 1.5).set({ attack: 0.2, release: 0.5 }),
    ],
    initialVolume: options.initialVolume,
  })
)

export const reverbKick = providePreset(
  defaultKickOptions,
  (options): InstChConf => ({
    inst: new Tone.MembraneSynth(),
    effects: [
      new Tone.Filter({ frequency: options.highPassFreq, type: 'highpass' }),
      new Tone.Filter({ frequency: options.lowPassFreq, type: 'lowpass' }),
      new Tone.Reverb(1),
      new Tone.Distortion(0.3),
    ],
    initialVolume: options.initialVolume,
  })
)

export const defaultTom = providePreset(
  {
    highPassFreq: 100,
    lowPassFreq: 200,
    initialVolume: -20,
  },
  (options): InstChConf => ({
    inst: new Tone.PolySynth(Tone.MembraneSynth).set({
      envelope: { attack: 0, sustain: 0.2, decay: 0.1, release: 0 },
    }),
    effects: [
      new Tone.Filter({ frequency: options.highPassFreq, type: 'highpass' }),
      new Tone.Filter({ frequency: options.lowPassFreq, type: 'lowpass' }),
      new Tone.Compressor(-4, 1.5).set({ attack: 0.5, release: 0.1 }),
    ],
    initialVolume: options.initialVolume,
  })
)

export const noiseHH = providePreset(
  {},
  (): InstChConf => ({
    inst: new Tone.NoiseSynth(),
    effects: [],
    initialVolume: -10,
  })
)
