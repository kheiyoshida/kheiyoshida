import * as Tone from 'tone'

export const toneStart = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
}

export const polysynth = new Tone.PolySynth(Tone.Synth, {
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
  detune: -10,
}).toDestination()

export const polysynth2 = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
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
}).toDestination()

export const play = () => {
  toneStart()
  const env = new Tone.AmplitudeEnvelope({
    attack: 0.8,
    decay: 1,
    sustain: 0.5,
    release: 3,
  }).toDestination()
  const osc = new Tone.Oscillator('C4', 'sine')
  osc.detune.value = -3
  osc.volume.value = -10
  osc.connect(env).start()

  const osc2 = new Tone.Oscillator('C4', 'sine')
  osc2.volume.value = -10
  osc2.connect(env).start()

  // const osc3 = new Tone.Oscillator()
  // osc3.frequency.value = 'F#5'
  // osc3.connect(env).start()

  env.triggerAttackRelease('4n')
}
