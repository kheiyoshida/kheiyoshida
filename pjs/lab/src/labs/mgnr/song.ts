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

export const composite = new mgnr.CompositeInstrument(polysynth, polysynth2)

export const prepareSong = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 60, max: 100 })
  const mixer = mgnr.getMixer()

  mono.triggerAttackRelease('C4', 4, '+0.5', 0.5)
  mono.triggerAttackRelease('C5', 2, '+1', 0.5)

  const synCh = mixer.createInstChannel({
    inst: mono,
    volumeRange: { min: -20, max: -10 },
    initialVolume: -10,
    // effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })

  const outlet = mgnr.createOutlet(synCh, true)
  const port1 = outlet.createPort()

  const generator = mgnr.createGenerator({
    scale: scale,
    length: 8,
    division: 8,
    density: 1,
    noteDur: 1,
    fillPref: 'mono',
    fillStrategy: 'fixed',
  })

  // generator.constructNotes({
  //   0: [
  //     {
  //       pitch: 60,
  //       vel: 127,
  //       dur: 4,
  //     },
  //   ],
  // })
  generator
    .feedOutlet(port1)
    .loopSequence(4)
    .onEnded((mes) => {
      // mes.out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
      mes.repeatLoop()
    })

  const generator2 = mgnr.createGenerator({
    scale: scale,
    length: 8,
    division: 8,
    density: 1,
    noteDur: 1,
    fillPref: 'mono',
    fillStrategy: 'fixed',
  })
  
  const port = outlet.createPort()
  // generator2.constructNotes({
  //   2: [
  //     {
  //       pitch: 62,
  //       vel: 100,
  //       dur: 4,
  //     },
  //   ],
  // })
  generator2
    .feedOutlet(port)
    .loopSequence(2)
    .onEnded((mes) => mes.repeatLoop())
}
