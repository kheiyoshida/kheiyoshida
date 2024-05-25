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

const mono = new Tone.MonoSynth({
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0,
    decay: 1,
    sustain: 1,
    release: 0,
  },
  volume: -20,
  detune: -200,
})

const mono2 = new Tone.MonoSynth({
  oscillator: {
    type: 'triangle8',
  },
  envelope: {
    attack: 0,
    decay: 1,
    sustain: 1,
    release: 0,
  },
  volume: -20,
  detune: 200,
})

export const composite = new mgnr.CompositeInstrument(mono, mono2)

export const prepareSong = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 30, max: 80 })
  const mixer = mgnr.getMixer()

  const synCh = mixer.createInstChannel({
    inst: composite,
    volumeRange: { min: -20, max: -10 },
    initialVolume: -10,
    effects: [new Tone.PingPongDelay('.4n', 0.3)],
  })

  const outlet = mgnr.createOutlet(synCh, Tone.Transport.toSeconds('16n'))
  const port1 = outlet.createPort()

  const generator = mgnr.createGenerator({
    scale: scale,
    length: 8,
    division: 8,
    density: 0.5,
    noteDur: 1,
    fillPref: 'mono',
    // fillStrategy: 'fixed',
  })

  generator.constructNotes()
  generator
    .feedOutlet(port1)
    .loopSequence(1)
    .onEnded((mes) => {
      mes.out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
      mes.repeatLoop()
    })

  const generator2 = mgnr.createGenerator({
    scale: scale,
    length: 10,
    division: 8,
    density: 0.5,
    noteDur: 1,
    fillPref: 'mono',
  })

  const port = outlet.createPort()
  generator2.constructNotes()
  generator2
    .feedOutlet(port)
    .loopSequence(2)
    .onEnded((mes) => mes.repeatLoop())
}
