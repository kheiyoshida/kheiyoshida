import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const polysynth = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'triangle',
  },
  envelope: {
    attack: 0,
    decay: 0.8,
    sustain: 0.3,
    release: 0.1,
  },
  volume: -20,
  detune: -20,
})

export const polysynth2 = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sawtooth4',
  },
  envelope: {
    attack: 0.5,
    decay: 0.3,
    sustain: 0.3,
    release: 0.5,
  },
  volume: -10,
  detune: 100,
  filter: {
    type: 'lowpass',
    frequency: 2000,
  },
})

const mono = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.8,
    sustain: 0.2,
    release: 0.5,
  },
  volume: -20,
  detune: -200,
})

const mono2 = new Tone.NoiseSynth({
  envelope: {
    attack: 0,
    decay: 0.6,
    sustain: 0.05,
    release: 0,
  },
  volume: -30,
})

export const composite = new mgnr.LayeredInstrument([
  { min: 20, max: 50, inst: mono },
  { min: 60, max: 100, inst: mono2 },
])

export const composite2 = new mgnr.CompositeInstrument(polysynth, polysynth2)

export const prepareSong = () => {
  const scale = mgnr.createScale('C', 'major', { min: 30, max: 80 })
  const scale2 = mgnr.createScale('C', 'omit25', { min: 57, max: 80 })
  const mixer = mgnr.getMixer()

  const synCh = mixer.createInstChannel({
    inst: composite,
    initialVolume: -6,
    effects: [
      new Tone.BitCrusher(16),
    ]
  })
  const compositeCh = mixer.createInstChannel({
    inst: composite2,
    initialVolume: -20,
    effects: [
      new Tone.Filter(300, 'highpass'),
      new Tone.BitCrusher(16),
      new Tone.PingPongDelay('.8n', 0.3)
    ]
  })

  const outlet = mgnr.createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

  const port1 = outlet.createPort()

  const generator = mgnr.createGenerator({
    scale: scale,
    length: 16,
    division: 16,
    density: 0.5,
    noteDur: 1,
    fillPref: 'mono',
    // fillStrategy: 'fixed',
  })

  generator.constructNotes({
    0: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
      {
        pitch: 80,
        dur: 1,
        vel: 100,
      },
    ],
    4: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
    8: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
    12: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
  })
  generator
    .feedOutlet(port1)
    .loopSequence(2)
    .onEnded((mes) => {
      mes.out.generator.mutate({ rate: 0.5, strategy: 'move' })
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

  const outlet2 = mgnr.createOutlet(compositeCh.inst)
  const o2p1 = outlet2.createPort()
  const g = mgnr.createGenerator({
    scale: scale2,
    length: 10,
    division: 16,
    density: 0.7,
    noteDur: {
      min: 4,
      max: 8,
    },
    fillPref: 'mono',
  })
  g.constructNotes()
  g.feedOutlet(o2p1)
    .loopSequence(4)
    .onElapsed(() => {
      g.mutate({ rate: 0.5, strategy: 'inPlace' })
    })
    .onEnded((mes) => {
      g.mutate({ rate: 0.5, strategy: 'randomize' })
      mes.repeatLoop()
    })
}
