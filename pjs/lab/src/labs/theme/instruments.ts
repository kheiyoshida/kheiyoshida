import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const createDrumMachine = () => {
  const kick = new Tone.MembraneSynth({
    envelope: {
      attack: 0,
      decay: 0.8,
      sustain: 0.2,
      release: 0.5,
    },
    volume: -10,
    detune: -200,
  })

  const hh = new Tone.NoiseSynth({
    envelope: {
      attack: 0,
      decay: 0.1,
      sustain: 1 / 100,
      release: 0,
    },
    volume: -12,
  })

  const snare = new mgnr.CompositeInstrument(
    new Tone.MembraneSynth({
      oscillator: {
        type: 'square32',
      },
      envelope: {
        attack: 0,
        decay: 0.5,
        sustain: 0.3,
        release: 0.2,
      },
      volume: -34,
      detune: -500,
    }),
    new Tone.NoiseSynth({
      envelope: {
        attack: 0,
        decay: 0.05,
        sustain: 0.01,
        release: 0,
      },
      volume: -10,
    })
  )

  const drumMachine = new mgnr.LayeredInstrument([
    { min: 20, max: 40, inst: kick },
    { min: 40, max: 60, inst: snare },
    { min: 60, max: 100, inst: hh },
  ])
  return drumMachine
}

export const createSynth = () => {
  const synth = new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine2',
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.2,
        release: 0,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine4',
      },
      detune: -100,
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.2,
        release: 0,
      },
    }),
  )
  return synth
}

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
    }),
  )
  return synth
}
