import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const droneBass = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.8,
        decay: 0.5,
        sustain: 0.8,
        release: 0.5,
      },
      volume: -12,
      filter: {
        type: 'lowpass',
        frequency: 100,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'square2',
      },
      envelope: {
        attack: 0.8,
        decay: 0.5,
        sustain: 0.3,
        release: 0.5,
      },
      volume: -18,
      detune: -10,
      filter: {
        type: 'lowpass',
        frequency: 100,
      },
    })
  )
