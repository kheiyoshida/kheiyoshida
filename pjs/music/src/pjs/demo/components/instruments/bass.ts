import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

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
