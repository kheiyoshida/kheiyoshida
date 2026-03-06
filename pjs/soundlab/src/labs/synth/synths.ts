import * as Tone from 'tone'
import { createNuancePad } from './preset'

export const toneStart = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
}

export const polysynth = new Tone.MonoSynth( {
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
  }
})

export const polysynth2 = new Tone.MonoSynth({
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
  }
})

// export const composite = new MGNR.CompositeInstrument(polysynth, polysynth2)
export const composite = createNuancePad()

const vol = new Tone.Channel().toDestination()
composite.connect(vol)
