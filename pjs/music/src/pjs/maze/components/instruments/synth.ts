import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const thinSynth = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine',
      },
      detune: -10,
      volume: -10,
      envelope: {
        attack: 0.05,
        decay: 0.8,
        sustain: 0.2,
        release: 1.5,
      },
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle',
      },
      detune: -8,
      volume: -24,
      envelope: {
        attack: 0.05,
        decay: 0.5,
        sustain: 0.2,
        release: 1,
      },
      filter: {
        type: 'lowpass',
        frequency: 1000,
      },
    })
  )
