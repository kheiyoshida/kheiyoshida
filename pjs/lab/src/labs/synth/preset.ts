import * as mgnr from '@mgnr/tone'
import * as Tone from 'tone'

export const createNuancePad = () => {
  const polysynth = new Tone.PolySynth(Tone.MonoSynth, {
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.2,
      decay: 0.2,
      sustain: 0.5,
      release: 0.2,
    },
    volume: -10,
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
      release: 0.2,
    },
    volume: -24,
    detune: 20,
    filter: {
      type: 'bandpass',
      frequency: 1000,
    },
  })
  const composite = new mgnr.CompositeInstrument(polysynth, polysynth2)
  return composite
}

export const wonderBass = () => {
  const syn = new Tone.MonoSynth({
    oscillator: {
      type: 'pulse',
    },
    envelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 0.1,
      release: 0.3,
    },
    volume: -10,
    detune: -100,
    filter: {
      type: 'lowpass',
      frequency: 100,
    },
    filterEnvelope: {
      attack: 0.7,
      decay: 0.3,
      sustain: 0.1,
      release: 0.5,
    },
  })

  const syn2 = new Tone.MonoSynth({
    oscillator: {
      type: 'sawtooth4',
    },
    envelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 0.1,
      release: 0.3,
    },
    volume: -20,
    detune: 100,
    filter: {
      type: 'lowpass',
      frequency: 100,
    },
  })
  const composite = new mgnr.CompositeInstrument(syn, syn2)
  return composite
}
