import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const darkPad = () =>
  new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine2',
      },
      detune: -4,
      volume: -24,
      envelope: {
        attack: 0,
        decay: 0.5,
        sustain: 0.3,
        release: 0.1,
      },
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    }),
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine',
      },
      detune: -8,
      volume: -10,
      envelope: {
        attack: 0,
        decay: 0.3,
        sustain: 0.2,
        release: 0.1,
      },
      filter: {
        type: 'lowpass',
        frequency: 1000,
      },
    })
  )
