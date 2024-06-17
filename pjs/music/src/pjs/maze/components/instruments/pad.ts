import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const darkPad = () =>
  new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.5,
        release: 0,
      },
      volume: -10,
      detune: -10,
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    }),
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine2',
      },
      detune: -20,
      volume: -40,
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.2,
        release: 0,
      },
      filter: {
        type: 'lowpass',
        frequency: 1000,
      },
    })
  )
