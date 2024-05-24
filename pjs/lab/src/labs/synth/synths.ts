import * as Tone from 'tone'
import * as MGNR from 'mgnr-tone'

export const toneStart = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
}

export const polysynth = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.3,
    release: 0.3,
  },
  volume: -10,
  detune: -20,
  filter: {
    type: 'lowpass',
    frequency: 100,
  },
})

export const polysynth2 = new Tone.PolySynth(Tone.AMSynth, {
  oscillator: {
    type: 'sine4',
  },
  modulation: {
    type: 'sine4',
  },
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.3,
    release: 0.3,
  },
  volume: -20,
  detune: 5,
})

export const composite = new MGNR.CompositeInstrument(polysynth, polysynth2)

const vol = new Tone.Channel().toDestination()
composite.connect(vol)
