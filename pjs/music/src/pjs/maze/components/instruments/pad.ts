import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const darkPad = () =>
  new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine4',
      },
      detune: -10,
      volume: -10,
      envelope: {
        attack: 0,
        decay: 0.5,
        sustain: 0.1,
        release: 0.02,
      },
      filter: {
        type: 'lowpass',
        frequency: 800,
      },
    }),
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'triangle2',
      },
      detune: -20,
      volume: -24,
      envelope: {
        attack: 0,
        decay: 0.3,
        sustain: 0.2,
        release: 0.02,
      },
      filter: {
        type: 'lowpass',
        frequency: 600,
      },
    })
  )
