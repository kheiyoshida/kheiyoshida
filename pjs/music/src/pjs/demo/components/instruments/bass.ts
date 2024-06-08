import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const darkBass = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine4',
      },
      envelope: {
        attack: 0.01,
        decay: 0.8,
        sustain: 0.2,
        release: 0.1,
      },
      volume: -10,
      filter: {
        type: 'lowpass',
        frequency: 500,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle2',
      },
      envelope: {
        attack: 0.01,
        decay: 0.8,
        sustain: 0.4,
        release: 0.1,
      },
      volume: -10,
      detune: -100,
      filter: {
        type: 'lowpass',
        frequency: 100,
      },
    })
  )

export const neutralBass = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth14',
      },
      envelope: {
        attack: 0.01,
        decay: 0.8,
        sustain: 0.6,
        release: 0.1,
      },
      volume: -10,
      filter: {
        type: 'lowpass',
        frequency: 500,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle20',
      },
      envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.4,
        release: 0.1,
      },
      volume: -10,
      detune: 20,
      filter: {
        type: 'highpass',
        frequency: 3000,
      },
    })
  )

export const brightBass = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle4',
      },
      envelope: {
        attack: 0.01,
        decay: 0.7,
        sustain: 0.3,
        release: 0.1,
      },
      detune: 20,
      volume: -6,
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'pulse',
      },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.05,
        release: 0,
      },
      volume: -16,
      detune: -20,
      filter: {
        type: 'highpass',
        frequency: 1000,
      },
    })
  )

export const droneBass = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.5,
        decay: 0.5,
        sustain: 0.8,
        release: 0.5,
      },
      volume: -10,
      filter: {
        type: 'lowpass',
        frequency: 100,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'square2',
      },
      envelope: {
        attack: 0.2,
        decay: 0.5,
        sustain: 0.3,
        release: 0.5,
      },
      volume: -20,
      detune: 100,
      filter: {
        type: 'lowpass',
        frequency: 100,
      },
    })
  )

export const wonderBass = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'pulse',
      },
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.1,
        release: 0.5,
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
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth4',
      },
      envelope: {
        attack: 0.2,
        decay: 0.5,
        sustain: 0.1,
        release: 0.5,
      },
      volume: -20,
      detune: 100,
      filter: {
        type: 'lowpass',
        frequency: 100,
      },
    })
  )
