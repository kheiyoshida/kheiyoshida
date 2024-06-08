import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

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
    })
  )
  return synth
}
