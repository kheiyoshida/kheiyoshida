import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const thinSynth = () =>
  new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sawtooth4',
      },
      detune: -12,
      volume: -12,
      envelope: {
        attack: 0.02,
        decay: 0.02,
        sustain: 0.12,
        release: 0.2,
      },
      filter: {
        type: 'lowpass',
        frequency: 1800,
      },
    }),
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'triangle2',
      },
      detune: -12,
      volume: -24,
      envelope: {
        attack: 0.01,
        decay: 0.12,
        sustain: 0.25,
        release: 0.33,
      },
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    })
  )
