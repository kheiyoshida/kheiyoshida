import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

const pinkNoise = () =>
  new Tone.NoiseSynth({
    noise: {
      type: 'pink',
    },
    envelope: {
      attack: 0,
      decay: 1,
      sustain: 1,
      release: 0,
    },
    volume: -10,
  })

const brownNoise = () =>
  new Tone.NoiseSynth({
    noise: {
      type: 'brown',
    },
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.5,
      release: 0,
    },
    volume: -10,
  })

const whiteNoise = () =>
  new Tone.NoiseSynth({
    noise: {
      type: 'white',
    },
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.5,
      release: 0,
    },
    volume: -10,
  })

export const noise = () =>
  new mgnr.LayeredInstrument([
    { min: 20, max: 40, inst: brownNoise() },
    { min: 40, max: 60, inst: pinkNoise() },
    { min: 60, max: 80, inst: pinkNoise() },
    { min: 80, max: 100, inst: whiteNoise() },
  ])
