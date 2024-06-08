import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const createPadSynth = () => {
  const synth = new mgnr.CompositeInstrument(
    new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.2,
        release: 0.5,
      },
      detune: 20,
    }),
    new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine4',
      },
      detune: -20,
      envelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 0.2,
        release: 0.5,
      },
    })
  )
  return synth
}

export const createNuancePad = () => {
  const polysynth = new Tone.PolySynth(Tone.MonoSynth, {
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
  })
  const polysynth2 = new Tone.PolySynth(Tone.MonoSynth, {
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
  const composite = new mgnr.CompositeInstrument(polysynth, polysynth2)
  return composite
}