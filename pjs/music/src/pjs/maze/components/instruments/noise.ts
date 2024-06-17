import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

const longNoise = () =>
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

const shortNoise = () =>
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

export const noise = () =>
  new mgnr.LayeredInstrument([
    { min: 20, max: 50, inst: longNoise() },
    { min: 50, max: 80, inst: shortNoise() },
  ])
