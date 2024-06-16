import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const darkLead = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle2',
      },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.2,
        release: 0.1,
      },
      volume: -16,
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth8',
      },
      detune: -20,
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.15,
        release: 0.05,
      },
    })
  )

export const neutralLead = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'pulse',
      },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.2,
        release: 0.05,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth8',
      },
      detune: 10,
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.2,
        release: 0.05,
      },
      filter: {
        type: 'lowpass',
        frequency: 2000,
      },
    })
  )

export const brightLead = () =>
  new mgnr.CompositeInstrument(
    new Tone.AMSynth({
      oscillator: {
        type: 'amsawtooth10',
      },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.1,
        release: 0.05,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'sine20',
      },
      detune: -5,
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.3,
        release: 0.05,
      },
      volume: -10,
      filter: {
        type: 'highpass',
        frequency: 300,
      },
    })
  )

export const anxiousThinSynth = () =>
  new mgnr.CompositeInstrument(
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
      detune: -40,
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.2,
        release: 0,
      },
    })
  )
