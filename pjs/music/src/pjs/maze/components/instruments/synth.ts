import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const thinSynth = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine2',
      },
      detune: -4,
      volume: -24,
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0,
        release: 0.8,
      },
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine',
      },
      detune: -8,
      volume: -10,
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0,
        release: 0.8,
      },
      filter: {
        type: 'lowpass',
        frequency: 1000,
      },
    })
  )
