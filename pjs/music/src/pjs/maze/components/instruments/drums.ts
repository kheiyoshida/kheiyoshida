import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const tightKick = () =>
  new Tone.MembraneSynth({
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.3,
      release: 0.05,
    },
    detune: -80,
    volume: -6,
  })

export const closedHihat = () =>
  new Tone.NoiseSynth({
    envelope: {
      attack: 0,
      decay: 0.1,
      sustain: 1 / 100,
      release: 0,
    },
    volume: -10,
  })

export const openHihat = () =>
  new Tone.NoiseSynth({
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.4,
      release: 0.05,
    },
    volume: -12,
  })

export const explicitSnare = () =>
  new mgnr.CompositeInstrument(
    new Tone.MembraneSynth({
      oscillator: {
        type: 'square24',
      },
      detune: -500,
      envelope: {
        attack: 0,
        decay: 0.3,
        sustain: 1 / 500,
        release: 0.1,
      },
      volume: -22,
    }),
    new Tone.NoiseSynth({
      envelope: {
        attack: 0,
        decay: 0.5,
        sustain: 1 / 500,
        release: 0.3,
      },
      volume: -10,
      noise: {
        type: 'brown',
      },
    }),
    new Tone.NoiseSynth({
      envelope: {
        attack: 0,
        decay: 0.2,
        sustain: 1 / 1000,
        release: 0.05,
      },
      volume: -3,
      noise: {
        type: 'pink',
      },
    })
  )

export const tightSnare = () =>
  new mgnr.CompositeInstrument(
    new Tone.MembraneSynth({
      oscillator: {
        type: 'sawtooth',
      },
      detune: -400,
      envelope: {
        attack: 0,
        decay: 0.15,
        sustain: 1 / 500,
        release: 0.05,
      },
      volume: -12,
    }),
    new Tone.NoiseSynth({
      envelope: {
        attack: 0,
        decay: 0.1,
        sustain: 1 / 1000,
        release: 0,
      },
      volume: -3,
      noise: {
        type: 'pink',
      },
    })
  )

const createDrumMachine = (kick = tightKick(), snare = tightSnare(), hh = closedHihat()) =>
  new mgnr.LayeredInstrument([
    { min: 20, max: 40, inst: kick },
    { min: 40, max: 60, inst: snare },
    { min: 60, max: 100, inst: hh },
  ])

export const drums = () => createDrumMachine()
