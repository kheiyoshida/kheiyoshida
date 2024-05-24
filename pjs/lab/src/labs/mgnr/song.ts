import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const polysynth = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0.5,
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

export const polysynth2 = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0.5,
    decay: 0.3,
    sustain: 0.3,
    release: 0.3,
  },
  volume: -20,
  detune: -200,
})

export const composite = new mgnr.CompositeInstrument(polysynth, polysynth2)

export const prepareSong = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 60, max: 100 })
  const mixer = mgnr.getMixer()

  const synCh = mixer.createInstChannel({
    inst: composite,
    volumeRange: { min: -20, max: -10 },
    initialVolume: -10,
    effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })
  const synOut = mgnr.createOutlet(synCh)

  const generator = mgnr.createGenerator({
    scale: scale,
    length: 32,
    division: 8,
    density: 0.8,
    noteDur: {
      min: 4,
      max: 6,
    },
  })

  generator.constructNotes()
  generator
    .feedOutlet(synOut)
    .loopSequence(4)
    .onEnded((mes) => {
      mes.out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
      mes.repeatLoop()
    })
}
