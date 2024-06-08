import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const darkPad = () =>
  new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.2,
        decay: 0.5,
        sustain: 0.5,
        release: 1.5,
      },
      detune: 20,
    }),
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'triangle2',
      },
      detune: -20,
      envelope: {
        attack: 0.2,
        decay: 0.5,
        sustain: 0.5,
        release: 1.5,
      },
      filter: {
        type: 'lowpass',
        frequency: 1000,
      },
    })
  )

export const nuancePad = () =>
  new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.2,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8,
      },
      volume: -6,
      detune: -20,
      filter: {
        type: 'lowpass',
        frequency: 1000,
      },
    }),
    new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: {
        type: 'sawtooth',
      },
      envelope: {
        attack: 0.2,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8,
      },
      volume: -12,
      detune: 20,
      filter: {
        type: 'bandpass',
        frequency: 1000,
      },
    })
  )
