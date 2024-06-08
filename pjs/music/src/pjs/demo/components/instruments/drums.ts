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
      volume: -20,
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
